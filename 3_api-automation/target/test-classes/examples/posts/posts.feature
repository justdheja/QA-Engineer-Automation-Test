Feature: Get posts from JSON Placeholder

  Background:
    * url 'https://jsonplaceholder.typicode.com/'
    * def expectedOutput = read('./posts-response.json')

  Scenario: Get posts from json placeholder
    Given path 'posts'
    When method GET
    Then status 200
    And match response == '#[100]'
    And match each response == expectedOutput