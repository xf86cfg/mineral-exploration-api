# Endpoints

- root - https://6hx2wweu9f.execute-api.ap-southeast-1.amazonaws.com/api
- healtcheck - https://6hx2wweu9f.execute-api.ap-southeast-1.amazonaws.com/api/healthcheck

## Postman Collection
./mineral-exploration-api.postman_collection.json

# Local dev environment
- yarn
- yarn mongo:docker
- yarn build && yarn test
- yarn start

# Assignment Decomposition
- Time series (readings) are sent from a source to a server via HTTP API.
- Readings contain lattitude, longitude, dip, depth and azimuth attributes.
- Some readings may be invalid.
- Raw readings are persisted in store sequentually for each reader.
- Readings may be queried by given longitude and latitude attributes.
- Readings may be queried based on specific business rules.

## Requires further clarification
- Coordinates geocoding standard (ISO/CRS)
- Definition of invalid reading. It's not clear wether invalid is an additional attribute of an event (e.g. it may be injected by ML layer in the front of API) or is it all reading with azimuth and dip difference are considered invalid.

# Assumptions
- Each source actor is unique and represented by 'readerId' value
- As none of geocoding stadards were defined in the task, for prototyping it's assumed coordinates are provided in free-value number format. It is advised though, once geocoding standard is clarified to create geospacial indexes in MongoDb and change domain event type and validations accordingly.
- As coordinates accuracy tolerance and geocoding requrements are not defined, it's assumed that lattitude and logitude parameters on request are strictly matched with data query.
- It's assumed that invalid readings have 'invalid=true' attribute which is injected by some middleware in request.
- It's assumed that readerId is injected into request either by authentication middleware or by reader itself.

# Implementation
- Each raw time series event is immutable and at write stage has an incremental version which is together with readerId represents a unique event from a particular reader.
- Each raw event is persisted with 'position' property which is unique and incremental within a MongoDb cluster.
- Concensus of write concern is achieved when at least two nodes in cluster have replicated a new event event.
- Repo wrapper incapsulates data layer consumption and exposes methods required for writiting and reading events.
- Command handling wrapper abstracts all repo usage concerns from domain logic.
- Event handling wrapper implements events subscription for assembling read models for further consumption.
- One event store for raw events and two read model stores are created and migrations are run with migration script.
- Migration is run on CI/CD pipeline before backend deployment.
- Command handlers and event handlers are deployed each on separate container.
