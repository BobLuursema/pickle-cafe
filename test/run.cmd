@ECHO OFF
SET TESTCAFE_PROXY=10.55.1.11:9400
SET TESTCAFE_DEBUG=0
SET TESTCAFE_BROWSERS=path:../../chrome.lnk
SET TESTCAFE_REPORT=reports

call .\node_modules\.bin\cucumber-js