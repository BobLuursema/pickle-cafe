@ECHO OFF
SET TESTCAFE_DEBUG=0
SET TESTCAFE_BROWSERS=chrome
SET TESTCAFE_REPORT=reports
SET DEBUG="pickle-cafe:*"

call .\node_modules\.bin\cucumber-js