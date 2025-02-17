@echo off
setlocal enabledelayedexpansion

rem Use this script to start a docker container for a local development database
set DB_CONTAINER_NAME=spiral-postgres

rem Check if Docker is installed
where docker >nul 2>nul
if errorlevel 1 (
    echo Docker is not installed. Please install Docker and try again.
    echo Docker install guide: https://docs.docker.com/engine/install/
    exit /b 1
)

rem Check if Docker daemon is running
docker info >nul 2>nul
if errorlevel 1 (
    echo Docker daemon is not running. Please start Docker and try again.
    exit /b 1
)

rem Check if the database container is already running
for /f "tokens=*" %%i in ('docker ps -q -f "name=%DB_CONTAINER_NAME%"') do (
    if not "%%i"=="" (
        echo Database container '%DB_CONTAINER_NAME%' already running
        exit /b 0
    )
)

rem Check if the database container exists but is not running
for /f "tokens=*" %%i in ('docker ps -q -a -f "name=%DB_CONTAINER_NAME%"') do (
    if not "%%i"=="" (
        docker start %DB_CONTAINER_NAME%
        echo Existing database container '%DB_CONTAINER_NAME%' started
        exit /b 0
    )
)

rem Import env variables from .env
for /f "usebackq tokens=1,* delims==" %%a in (.env) do (
    set "%%a=%%b"
)

set DATABASE_URL=%DATABASE_URL%
rem Remove quotes from DATABASE_URL if present
set DATABASE_URL=%DATABASE_URL:"=%

rem Extract password from DATABASE_URL
for /f "tokens=3 delims=:" %%a in ("%DATABASE_URL%") do (
    for /f "tokens=1 delims=@" %%b in ("%%a") do (
        set "DB_PASSWORD=%%b"
    )
)

rem Extract port from DATABASE_URL
for /f "tokens=4 delims=:" %%a in ("%DATABASE_URL%") do (
    for /f "tokens=1 delims=/" %%b in ("%%a") do (
        set "DB_PORT=%%b"
    )
)

rem Set default port if not found
if "%DB_PORT%"=="" (
    set "DB_PORT=5432"
)

if "%DB_PASSWORD%"=="password" (
    echo You are using the default database password
    set /p REPLY="Should we generate a random password for you? [y/N]: "
    if /i not "!REPLY!"=="y" (
        echo Please change the default password in the .env file and try again
        exit /b 1
    )
    rem Generate a random URL-safe password
    set "DB_PASSWORD="
    for /l %%i in (1,1,12) do (
        set /a "rand=!random! %% 62"
        if !rand! lss 10 (
            set "DB_PASSWORD=!DB_PASSWORD!!rand!"
        ) else if !rand! lss 36 (
            set /a "char=!rand! - 10 + 65"
            for %%j in (!char!) do set "DB_PASSWORD=!DB_PASSWORD!%%~j"
        ) else (
            set /a "char=!rand! - 36 + 97"
            for %%j in (!char!) do set "DB_PASSWORD=!DB_PASSWORD!%%~j"
        )
    )
    rem
    powershell -Command "(Get-Content .env) -replace ':password@', ':!DB_PASSWORD!@' | Set-Content .env"
)

echo Using port: %DB_PORT%
echo Using password: %DB_PASSWORD%

docker run -d ^
    --name %DB_CONTAINER_NAME% ^
    -e POSTGRES_USER="postgres" ^
    -e POSTGRES_PASSWORD="%DB_PASSWORD%" ^
    -e POSTGRES_DB="docflux" ^
    -p %DB_PORT%:5432 ^
    postgres

echo Database container '%DB_CONTAINER_NAME%' was successfully created
