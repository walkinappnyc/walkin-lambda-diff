'use strict';

const parseString = require('xml2js').parseString
const request = require('request')
const fs = require('fs')
const dateTime = require('date-time')


const XMLUrl = `https://api.walk.in/api/Landlords`

module.exports.diff = (event, context, callback) => {
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  // };
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

		request(`${item.xml_feed_url}`, function (err, res, body) {
			// console.log('error:', err)
			// console.log('statusCode:', res && res.statusCode)
			// console.log('body', body)

		let xml = body
		parseString(xml, function (err, result) {
	    	// console.dir(result)

	    	let dataJSON = JSON.stringify(result)
	    	// console.log(result.streeteasy)
	    	// console.log(result.streeteasy.properties)
	    	// console.log(result.streeteasy.properties[0])
	 		//    console.log(`feed: ${item}`)
			// console.log(item.id)
			// console.log(item.company)


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
	    		let str = `${details[0].price[0]}` + `${location[0].address[0]}` + `${location[0].apartment[0]}` + `${location[0].city[0]}` + `${location[0].state[0]}`
	    		// console.log(`${str}`)
	    		let downcase = str.toLowerCase()
	    		let xml_id = downcase.replace(/ /g,'')
	    		console.log(`${xml_id}`)
	    	})
		})
		})
	})
}




  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
