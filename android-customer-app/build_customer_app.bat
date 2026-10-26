@echo off
set "JAVA_HOME=C:\Users\DELL\AppData\Local\Programs\jdk17\jdk-17.0.20.1+1"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Checking Java version...
"%JAVA_HOME%\bin\java.exe" -version

echo Building CashALL Customer App (Release APK)...
call gradlew.bat assembleRelease --no-daemon

if %ERRORLEVEL% equ 0 (
    echo Build Succeeded!
    copy /Y "app\build\outputs\apk\release\app-release.apk" "..\CashALL-Customer.apk"
    echo Copied APK to root directory as CashALL-Customer.apk
) else (
    echo Build Failed!
    exit /b %ERRORLEVEL%
)
