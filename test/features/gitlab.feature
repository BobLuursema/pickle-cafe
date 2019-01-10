Feature: Test PickleCafé

    Scenario: Generic test
        Given a user with username "test" and password "test"
        When the user tries to login
        Then the login fails

    Scenario: Client function test
        When a client function is called
        Then the url is available