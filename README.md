# Resto-rater

## Resto-rater is a command line tool for recommending a Restaurant based on 5 optional user inputs:
    1. Restaurant Name
    2. Customer Rating
    3. Distance
    4. Price
    5. Cuisine Type


## How to Run: 

    `npm install`
    `npm start`

### The npm package Inquirer was used for a better Command Line experience, and has the added benefit of pre-processing the user inputs.


## Assumptions: 
* The CSV input files are properly formatted, with each row on a new line.
    * Given more time I would like to add smarter parsing/error handling for less clean or unknown CSV sources


## Working Notes from Assessment README.md:
* Since this assessment includes a searching function, we kindly ask you to avoid out of box search engines such as ElasticSearch. Instead, you should write the searching logic by yourself.
* Develop basic search function that returns an option for coworker to have lunch

5 search criteria;
    1. Restaurant Name
    2. Customer Rating (1->5 *'s)
    3. Distance (1->10 miles)
    4. Price ($10->$50)
    5. Cuisine (Chinese, American, Thai, etc.)


Requirements:
    1. user provides up to 5 params
    2. if params are invalid, return error msg
    3. function should return up to 5 matches
        a. no matches found? return empty list
        b. <5 found? return all
        c. >5 found? return best 5
        d. returned results should be sorted
    4. "Best Match" definition
        a. Restaurant Name match: whole or substring match
        b. Customer Rating: returns items with >= required *'s
        c. Distance: returns items with <= required Distance
        d. Price: returns items <= desired Price
        e. Cuisine: whole or substring match of cuisines in cuisines.csv
        f. Multiple Match logic
            i. Sort by distance 1st
           ii. Customer Rating 2nd
          iii. Price 3rd
           iv. Randomly decide order from here
    5. Include a README, steps to run and test program outlined!
