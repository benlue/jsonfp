var  assert = require('assert'),
     jsonfp = require('../lib/lamdaApp.js');

before(function()  {
    // install built-in modules
    jsonfp.init();
});


describe('Test object query', function() {
    it('A really complicated object query', function() {
    	var  expr = {
    			"chain": [
				    [
				      {
				        "chain": [
				          {"getter": "Person_id"},
				          {"==": 1}
				        ]
				      },
				      {
				        "chain": [
				          [
				            {
				              "chain": [
				                [
				                  {
				                    "chain": [
				                      {"getter": "ownPsn"},
				                      {"==": 1}
				                    ]
				                  },
				                  {
				                    "chain": [
				                      {"getter": "mode"},
				                      {"&": 16}
				                    ]
				                  }
				                ],
				                {"reduce": "and"}
				              ]
				            },
				            {
				              "chain": [
				                [
				                  {
				                    "chain": [
				                      {"getter": "ownGrp"},
				                      {"==": 100}
				                    ]
				                  },
				                  {
				                    "chain": [
				                      {"getter": "mode"},
				                      {"&": 4}
				                    ]
				                  }
				                ],
				                {"reduce": "and"}
				              ]
				            },
				            {
				              "chain": [
				                {"getter": "mode"},
				                {"&": 1}
				              ]
				            }
				          ],
				          {"reduce": "or"}
				        ]
				      }
				    ],
				    {"reduce": "and"}
				  ]
    		 },
    		 data = [
				  {
				    "Person_id": 1,
				    "name": "Mike",
				    "dob": "1978-02-11T16:00:00.000Z",
				    "gender": 1,
				    "ownPsn": 1,
				    "ownGrp": 100,
				    "mode": 60,
				    "salary": 110000
				  }
			 ];
    	var  result = jsonfp.apply(data, {filter: expr});
    	//console.log(JSON.stringify(result, null, 4));
    	assert.equal(result.length, 1, '1 match');
    });
});