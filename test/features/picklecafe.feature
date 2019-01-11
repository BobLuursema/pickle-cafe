Feature: Test PickleCafé

    @testcafe
    Scenario: Generic test
        Given a user with username "test" and password "test"
        When the user tries to login
        Then the login fails

    @testcafe
    Scenario: Client function test
        When a client function is called
        Then the url is available
    
    Scenario: No TestCafe
        When a scenario has no TestCafe
        Then TestCafe is not booted