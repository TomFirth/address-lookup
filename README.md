# Address Lookup

Using [getaddress.io](https://getaddress.io/).

### What is this?

This is a address lookup service, providing an address from a postcode and/or postcode and house name/number.

### Doesn't this already exist elsewhere?

Probably, but I hadn't made one before and thought it might be fun.

### Usage:

If you clone this repo, you should be able to work it out. You will need to get keys from `getaddress.io` to populate the `.env_blank` file, this will then need to be renamed to `.env`

`::GET`
 - `/` - daily stats for number of searches (per 3rd party)
 - `/address?={POSTCODE}` && `/address?={POSTCODE}` - will give full address or a selection of address, if there are multiple returned.
 - - `{POSTCODE}` - the desired postcode for your search.
