const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

const getRandomPropertyValue = () => Math.floor(Math.random() * 10) + 1;

const data = [
  // NYC with 7 entries
  { RegionID: "NYC", Date: "2024-11-18", AveragePrice: 750000, Demand: "High", Timestamp: 1699992000 },
  { RegionID: "NYC", Date: "2024-11-19", AveragePrice: 740000, Demand: "Medium", Timestamp: 1700078400 },
  { RegionID: "NYC", Date: "2024-11-20", AveragePrice: 760000, Demand: "Low", Timestamp: 1700164800 },
  { RegionID: "NYC", Date: "2024-11-21", AveragePrice: 765000, Demand: "High", Timestamp: 1700251200 },
  { RegionID: "NYC", Date: "2024-11-22", AveragePrice: 745000, Demand: "Medium", Timestamp: 1700337600 },
  { RegionID: "NYC", Date: "2024-11-23", AveragePrice: 755000, Demand: "Low", Timestamp: 1700424000 },
  { RegionID: "NYC", Date: "2024-11-24", AveragePrice: 750000, Demand: "High", Timestamp: 1700510400 },

  // SFO with 6 entries
  { RegionID: "SFO", Date: "2024-11-18", AveragePrice: 850000, Demand: "Medium", Timestamp: 1699992000 },
  { RegionID: "SFO", Date: "2024-11-19", AveragePrice: 845000, Demand: "High", Timestamp: 1700078400 },
  { RegionID: "SFO", Date: "2024-11-20", AveragePrice: 830000, Demand: "Low", Timestamp: 1700164800 },
  { RegionID: "SFO", Date: "2024-11-21", AveragePrice: 835000, Demand: "Medium", Timestamp: 1700251200 },
  { RegionID: "SFO", Date: "2024-11-22", AveragePrice: 825000, Demand: "High", Timestamp: 1700337600 },
  { RegionID: "SFO", Date: "2024-11-23", AveragePrice: 840000, Demand: "Low", Timestamp: 1700424000 },

  // LA with 8 entries
  { RegionID: "LA", Date: "2024-11-19", AveragePrice: 720000, Demand: "Low", Timestamp: 1700078400 },
  { RegionID: "LA", Date: "2024-11-20", AveragePrice: 715000, Demand: "Medium", Timestamp: 1700164800 },
  { RegionID: "LA", Date: "2024-11-21", AveragePrice: 725000, Demand: "High", Timestamp: 1700251200 },
  { RegionID: "LA", Date: "2024-11-22", AveragePrice: 710000, Demand: "Low", Timestamp: 1700337600 },
  { RegionID: "LA", Date: "2024-11-23", AveragePrice: 730000, Demand: "Medium", Timestamp: 1700424000 },
  { RegionID: "LA", Date: "2024-11-24", AveragePrice: 735000, Demand: "High", Timestamp: 1700510400 },
  { RegionID: "LA", Date: "2024-11-25", AveragePrice: 740000, Demand: "Low", Timestamp: 1700596800 },
  { RegionID: "LA", Date: "2024-11-26", AveragePrice: 745000, Demand: "High", Timestamp: 1700683200 },

  // Chicago with 9 entries
  { RegionID: "Chicago", Date: "2024-11-19", AveragePrice: 650000, Demand: "High", Timestamp: 1700078400 },
  { RegionID: "Chicago", Date: "2024-11-20", AveragePrice: 640000, Demand: "Medium", Timestamp: 1700164800 },
  { RegionID: "Chicago", Date: "2024-11-21", AveragePrice: 630000, Demand: "Low", Timestamp: 1700251200 },
  { RegionID: "Chicago", Date: "2024-11-22", AveragePrice: 620000, Demand: "High", Timestamp: 1700337600 },
  { RegionID: "Chicago", Date: "2024-11-23", AveragePrice: 610000, Demand: "Medium", Timestamp: 1700424000 },
  { RegionID: "Chicago", Date: "2024-11-24", AveragePrice: 600000, Demand: "Low", Timestamp: 1700510400 },
  { RegionID: "Chicago", Date: "2024-11-25", AveragePrice: 590000, Demand: "High", Timestamp: 1700596800 },
  { RegionID: "Chicago", Date: "2024-11-26", AveragePrice: 580000, Demand: "Medium", Timestamp: 1700683200 },
  { RegionID: "Chicago", Date: "2024-11-27", AveragePrice: 570000, Demand: "Low", Timestamp: 1700769600 },

  // Miami with 6 entries
  { RegionID: "Miami", Date: "2024-11-19", AveragePrice: 550000, Demand: "Medium", Timestamp: 1700078400 },
  { RegionID: "Miami", Date: "2024-11-20", AveragePrice: 540000, Demand: "Low", Timestamp: 1700164800 },
  { RegionID: "Miami", Date: "2024-11-21", AveragePrice: 530000, Demand: "High", Timestamp: 1700251200 },
  { RegionID: "Miami", Date: "2024-11-22", AveragePrice: 520000, Demand: "Medium", Timestamp: 1700337600 },
  { RegionID: "Miami", Date: "2024-11-23", AveragePrice: 510000, Demand: "Low", Timestamp: 1700424000 },
  { RegionID: "Miami", Date: "2024-11-24", AveragePrice: 500000, Demand: "High", Timestamp: 1700510400 }
];

const populateData = async () => {
  for (const item of data) {
    const randomProperty1 = getRandomPropertyValue();
    const randomProperty2 = getRandomPropertyValue();

    const params = {
      TableName: "MarketTrends",
      Item: {
        RegionID: { S: item.RegionID },
        Date: { S: item.Date },
        AveragePrice: { N: item.AveragePrice.toString() },
        Demand: { S: item.Demand },
        Timestamp: { N: item.Timestamp.toString() },
        RandomProperty1: { N: randomProperty1.toString() },
        RandomProperty2: { N: randomProperty2.toString() },
      },
    };

    try {
      await client.send(new PutItemCommand(params));
      console.log(`Inserted: ${item.RegionID} with Random Properties`);
    } catch (error) {
      console.error(`Error inserting ${item.RegionID}:`, error);
    }
  }
};

populateData();
