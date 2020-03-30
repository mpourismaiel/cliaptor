# Clipator

This is a really simple program that simply watches for changes in clipboard and
saves them. The API allows you to fetch a list of stored clipboard items and
mark them as favorites to keep them between launches.

I'll add more stuff later on. This is just to make it work.

### Usage

Default host: `http://localhost:9102`

Schema: `host/verb/argument1/argument2`

#### Endpoints

- Read: `/read/:item-count/:text-length`
- Copy: `/copy/:id`
- Toggle favorite: `/mark/:id`
- Remove: `/remove/:id`
