'use strict';

const parseString = require('xml2js').parseString
const request = require('request')
const fs = require('fs')
const dateTime = require('date-time')
const AWS = require('aws-sdk')

const XMLUrl = `https://api.walk.in/api/Landlords`
const propUrl = `https://api.walk.in/api/Properties`

const lambda = new AWS.Lambda({
	region: 'us-east-1'
})

module.exports.diff = (event, context, callback) => {

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  }

  // console.log([1, 2, 3].diff([2, 3]))


 function getXMLFeeds() {
	let options = {
		url: `${XMLUrl}`,
		method: 'GET',
		headers: {
			'Accept': 'application/JSON'
		},
		json: true
	}

	const data = request(options, function(err, res, body) {
		let urlArr = []
		// console.log(urlArr)
		body.forEach(item => {
			console.log(`${JSON.stringify(item)}`)
			urlArr.push(item)
			// console.log(`${urlArrsa}`)
			return urlArr
		})
		createProperties(urlArr)
	})
}

getXMLFeeds()

function createProperties(xml_feeds) {
	console.log(`this is the array ${JSON.stringify(xml_feeds)}`)
	xml_feeds.forEach(feed => {
		console.log(`this is new feed ${feed}`)
		let item = feed

		// console.log(`feed: ${feed}`)
		// console.log(feed.id)
		// console.log(feed.company)
		 function getProps() {
			let options = {
				url: `${propUrl}`,
				method: 'GET',
				headers: {
					'Accept': 'application/JSON'
				},
				json: true
			}

			const data = request(options, function(err, res, body) {
				let propArr = []
				// console.log(urlArr)
				body.forEach(item => {
					// console.log(`${JSON.stringify(item.xml_id)}`)
					propArr.push(item.xml_id)
					// console.log(`${propArr}`)
					return propArr
				})
				getXMLId(propArr)
			})
		}

		getProps()

		function getXMLId(propArr) {

			console.log(`${propArr}`)
			const data = request(`${item.xml_feed_url}`, function (err, res, body) {

				let xml = body
				parseString(xml, function (err, result) {
			    	// console.dir(result)

			    	let dataJSON = JSON.stringify(result)

					let xmlIdArr = []

			    	result.streeteasy.properties[0].property.forEach(property => {
			    		let {
			    			$,
			    			location,
			    			details,
			    			openHouses,
			    			agents,
			    			media,
			    			applyUrl
			    		} = property

			    		// console.log(`${details[0].price[0]}`)
			    		// console.log(`${location[0].address[0]}`)
			    		// console.log(`${location[0].apartment[0]}`)
			    		// console.log(`${location[0].city[0]}`)
			    		// console.log(`${location[0].state[0]}`)
			    		// console.log(`${location[0].zipcode[0]}`)
			    		// console.log(`${$.id}-${item.id}`)
			    		// xmlIdArr.push(`${$.id}-${item.id}`)
			    		let str = `${details[0].price[0]}` + `${location[0].address[0]}` + `${location[0].apartment[0]}` + `${location[0].city[0]}` + `${location[0].state[0]}` + `${location[0].zipcode[0]}`
			    		// console.log(`${str}`)
			    		let downcase = str.toLowerCase()
			    		let xml_id = downcase.replace(/ /g,'')
			    		xmlIdArr.push(`${xml_id}`)
			    		// console.log(`${xml_id}`)
			    		return xmlIdArr
			    	})
			    	console.log(`${xmlIdArr}`)
			    	if (propArr === undefined) {
			    		[].diff(xmlIdArr)
			    		console.log([].diff(xmlIdArr))
			    	} else {
			    		propArr.diff(xmlIdArr)
			    		console.log(propArr.diff(xmlIdArr))
			    		let deleteArr = propArr.diff(xmlIdArr)
			    		deleteArr.forEach(item => {
			    			console.log(`${item}`)
			    			request.delete(`${propUrl}/${item}`, function(err, res, body) {

			    			})
			    		})

			    		const params = {
			                FunctionName: 'walkin-xml-lambda-dev-cron-job',
			                InvocationType: 'RequestResponse',
			                Payload: "true"
			             }

			    		lambda.invoke(params, function(error, res) {
						    console.log(`${res}`)
			                if (error) {
			                  console.error(JSON.stringify(error))
			                  return new Error(`Erorr sending message: ${JSON.stringify(error)}`)
			                } else if (res) {
			                  console.log(`${JSON.stringify(res)} - diff lambda invoked`)
			                  callback(null, res)
			                }
						 })
			    	}

				})
			})

		}

		getXMLId()

	})
}




  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
