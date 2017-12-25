# js-livr-extra-rules

LIVR specification contains the most common rules that every implementation should support. 

The module contains extra rules for LIVR. It is absolutely ok for LIVR to have your own custom rules in your project. But there are some rules that are useful cross projects. 


```javascript
import LIVR from livr;
import extraRules from 'livr-extra-rules';
LIVR.Validator.registerDefaultRules(extraRules);
```

## Rules 
 
 * ipv4 

### ipv4

Example:

```javascript
{
    field: 'ipv4'
}
```

Error codes: 'WRONG_IP'

## How to add own rule?

if you want to add own rule, you will need:

1. Create a new file for the rule in src/rules (see existing rules)
2. Add rule to src/index.js
3. Add positive tests to tests/test_suite/positive/your\_rule\_name/ (see existing tests)
4. Add negative tests to tests/test_suite/negative/your\_rule\_name/ (see existing tests)
5. Update this README!


### Rules TODO

The list of rules that are going to be added here

 * ipv6 
 * uuid
 * mongo\_object\_id
 * base64
 * phone
 * min\_iso\_date 
 * max\_iso\_date
 * iso\_date\_between
 * iso_time
 * required_if (check conflict\_with)
 * list\_length // {list\_length: 2}, {list\_length: [3, 5]} // list\_length\_between, list\_length\_min? 
 * credit\_card
 * iso\_future\ _date
