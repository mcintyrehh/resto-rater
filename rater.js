var fs = require("fs");
var inquirer = require("inquirer");

class RestoRater {
  constructor(
    restCSVPath = "./csv/restaurants.csv",
    cuisinePath = "./csv/cuisines.csv"
  ) {
    this.cuisines = this.csvToArrayOfObj(cuisinePath);
    this.cuisinesById = this.lookupByKey(this.cuisines, "id");
    this.restaurants = this.csvToArrayOfObj(restCSVPath);
  }
  /**
   * Utility function to convert *properly* formatted csv files to lookup objects
   * This will work just fine for this use case but for more robust error handling
   * or less clean CSV files I would look into:
   *   * CSVToArray by Ben Nadel:   https://stackoverflow.com/a/36288398
   *   * This npm package:   https://github.com/Keyang/node-csvtojson
   * @param {string: relative path to CSV file} pathToCSV
   * @returns {array of CSV entries, with the first entry is comprised of the key names}
   */
  csvToArrayOfObj = (pathToCSV) => {
    const data = fs.readFileSync(pathToCSV, "utf-8");
    const dataArray = data.split("\r\n");
    return this.arrayOfObjects(dataArray);
  };
  /**
   *
   * @param {Array<String>} array: array of CSV line entries containing comma separated values
   * @returns Array of objects with comma separated values mapped to their keys
   */
  arrayOfObjects = (array) => {
    let [keys, ...values] = array.reduce(
      (acc, elem) => [...acc, elem.split(",")],
      []
    );

    let arrOfObjs = values.reduce((acc, elem) => {
      const object = {};
      keys.forEach((key, index) => {
        //normalize the cuisine data to keep from unnecessary loops later on
        if (key === "cuisine_id") {
          let cuisineObj = this.cuisinesById[elem[index]];
          object["cuisine"] = cuisineObj["name"];
        } else if (key === "name") {
          object[key] = elem[index];
        } else {
          object[key] = parseInt(elem[index]);
        }
      });
      acc = [...acc, object];
      return acc;
    }, []);
    return arrOfObjs;
  };

  /**
   *
   * @param {Array} array: array to create lookup from
   * @param {String | Number} key: key (in array items) to create a lookup object from
   */
  lookupByKey = (array, key) => {
    return array.reduce((acc, elem) => {
      acc[elem[key]] = elem;
      return acc;
    }, {});
  };

  /**
   *
   * @param {Object of arguments by {argName: value}} args
   * @returns filtered array of restaurants that match user requirements
   * 
   * //TODO: This should be cleaned up so that the options array only has to be traversed once
   * and each option is checked against the provided inputs
   */
  filterOptions = (args) => {
    let options = [...this.restaurants];

    if (args.name) {
      options = options.filter(
        (item) => item.name.toLowerCase().indexOf(args.name.toLowerCase()) != -1
      );
    }
    if (args.customer_rating) {
      options = options.filter(
        (item) => item.customer_rating >= args.customer_rating
      );
    }

    if (args.distance) {
      options = options.filter((item) => item.distance <= args.distance);
    }

    if (args.price) {
      options = options.filter((item) => item.price <= args.price);
    }

    if (args.cuisine) {
      options = options.filter(
        (item) =>
          item.cuisine.toLowerCase().indexOf(args.cuisine.toLowerCase()) !== -1
      );
    }
    return options;
  };
  search = (args) => {
    const filteredOptions = this.filterOptions(args);
    return this.sortAndReturnTop5(filteredOptions);
  };
  sortAndReturnTop5 = (array) => {
    const sortedOptions = this.sort(array);
    return sortedOptions.slice(0, 5);
  };
  sort = (array) => {
    //Compare reminder: -1 means a comes first, 1 means b comes first, 0 means a==b
    let compare = (a, b) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      // If we get here distance is equal:
      if (a.customer_rating < b.customer_rating) return 1;
      if (b.customer_rating > a.customer_rating) return -1;
      // If we get here distance and customer rating are equal:
      if (a.price < b.price) return -1;
      if (a.price > b.price) return 1;
      // Restaurants must be equal
      return 0;
    };
    let sortedArray = array.sort(compare);

    return sortedArray;
  };
}

const questions = [
  {
    type: "input",
    name: "name",
    message: "Restaurant name (press enter to skip):",
    default() {
      return;
    },
  },
  {
    type: "list",
    name: "customer_rating",
    message: "Minimum customer rating (press enter to skip):",
    choices: [
      { name: "any", value: null },
      { name: "*****", value: 5 },
      { name: "****", value: 4 },
      { name: "***", value: 3 },
      { name: "**", value: 2 },
      { name: "*", value: 1 },
    ],
    default() {
      return;
    },
  },
  {
    type: "input",
    name: "distance",
    message: "Maximum distance from 1->10 miles (press enter to skip):",
    validate(value) {
      if (!value) return true;

      const int = parseInt(value);
      if (int >= 1 && int <= 10) {
        return true;
      }
      return "Please enter a distance between 1 and 10 miles.";
    },
    default() {
      return;
    },
  },
  {
    type: "input",
    name: "price",
    message: "Average price per person from $10->$50 (press enter to skip):",
    validate(value) {
      if (!value) return true;

      const int = parseInt(value);
      if (int >= 1 && int <= 50) {
        return true;
      }
      return "Please enter a price per person between $10 and $50.";
    },
    default() {
      return;
    },
  },
  {
    type: "input",
    name: "cuisine",
    message: "Cuisine(Chinese, American, Thai, etc.) (press enter to skip):",
    default() {
      return;
    },
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    const rater = new RestoRater();
    console.log(rater.search(answers));
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

module.exports = RestoRater;
