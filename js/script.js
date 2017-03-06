// CAN I CALL RIGHT NOW?
// OVERALL GOAL : create a webapp that compares 2 separate time zones based on a users city input 
// return a string to indicate what time it is in the desired timezone 2

const app = {};

// app.userCity= "";

app.timezoneURL =' https://maps.googleapis.com/maps/api/timezone/json';

app.locationURL = 'https://maps.googleapis.com/maps/api/geocode/json';

app.key = 'AIzaSyDT9CRL7u3ySpVpDis610VIZplXJGDfmbg';

app.init = function(){
	app.events();
};

//user types in a city into the text form and app gathers info to put into address field in ajax geolocation API call
//city is compared to the google geolocation API 
//function is gathering what user types in each field
//prevents the default submission
//stores both city values in objects
//stores both lat & lng strings in two separate consts
//stores both strings (values) in when and calls the timezone API with the location parameter
app.events = function(){
	$('#userForm').on('submit', function(e){
		e.preventDefault();
		$('.form__submit').hide();
		$('.form--userInput').hide();
		$('.tagline').hide();
		$('.fa-clock-o').removeClass('clockHero');
		$('.fa-clock-o').addClass('clockmini');
		$('button').removeClass('hidden');
		$('h1').removeClass('headerMargin');
		app.userCity = $('#userCity').val();
		app.otherCity = $('#otherCity').val();
		$.when(app.getLatLng(app.userCity),app.getLatLng(app.otherCity))
			.then(function(userLat, otherLat) {
				let userData = userLat[0];
				let otherData = otherLat[0];
				
				const userLt =  userData.results[0].geometry.location
				const otherLt = otherData.results[0].geometry.location
				console.log(userLt, otherLt);
				
				const userLoc = userData.results[0].formatted_address
				const otherLoc = otherData.results[0].formatted_address
				console.log(otherLoc,userLoc);

				const userPosition = `${userLt.lat}, ${userLt.lng}`
				const otherPosition = `${otherLt.lat}, ${otherLt.lng}`
				$.when(ajaxTimeCall(userPosition), ajaxTimeCall(otherPosition)).then(function(userTime, otherTime){
					userTime = userTime[0]
					otherTime = otherTime[0]
					const userRD = ((userTime.rawOffset * 1000) + (userTime.dstOffset * 1000))
					const otherRD = ((otherTime.rawOffset * 1000) + (otherTime.dstOffset * 1000))
				    const d = new Date();
					const utc = d.getTime() + (d.getTimezoneOffset() * 60000); 
					const newDate = new Date(utc+ (userRD));
					const newDate2 = new Date(utc+ (otherRD));
				// Compare general time difference to print on page 
				let timeDifference = ((((otherRD - userRD)/1000)/60)/60);

				let $timeDifference = $('<p>').text("That's a " +timeDifference + " hour difference.");
					$('.resultDifference').html($timeDifference);
				app.displayTimes(newDate, newDate2,userLoc, otherLoc);
			});
		});
	});
};


app.displayTimes = function(newDate,newDate2, userLoc, otherLoc){
	//function will display all my jquery items to the page 
	let userCityTime = newDate.toLocaleTimeString('en-GB');
	let otherCityTime = newDate2.toLocaleTimeString('en-GB');
	let userCityDate = newDate.toLocaleDateString('en-GB');
	let otherCityDate = newDate2.toLocaleDateString('en-GB');
	console.log(userCityTime);
	console.log(otherCityTime);

	$('.userLoc').html(userLoc);
	$('.otherLoc').html(otherLoc);

	let $userCityTime = $('<p>').text(userCityTime);
	let $otherCityTime = $('<p>').text(otherCityTime);
	$('.userLiveTime').html($userCityTime);
	$('.otherLiveTime').html($otherCityTime);

	let $userCityDate = $('<p>').text(userCityDate);
	let $otherCityDate = $('<p>').text(otherCityDate);
	$('.userDate').html($userCityDate);
	$('.otherDate').html($otherCityDate);

	let userCityNumber = parseInt(userCityTime.replace(/:/g,""));
		console.log(userCityTime);
		console.log(userCityNumber);

	let otherCityNumber = parseInt(otherCityTime.replace(/:/g,""));
		console.log(otherCityTime);
		console.log(otherCityNumber);

	// if statement that will determine the background colour of the div based on day or night
// determines what colour the users city's container will be
	if (userCityNumber >= 000001 && userCityNumber <= 60000){
		$('.userIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerDarkNight');
	}else if(userCityNumber >= 60001 && userCityNumber <= 120000){
		$('.userIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerLightDay');
	}else if(userCityNumber >= 120001 && userCityNumber <= 180000){
		$('.userIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerDay');
	}else{
		$('.userIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerNight');
	}

// determines what colour the other city's container will be 
	if (otherCityNumber >= 000001 && otherCityNumber <= 60000){
		$('.otherIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerDarkNight');
	}else if(otherCityNumber >= 60001 && otherCityNumber <= 120000){
		$('.otherIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerLightDay');
	}else if(otherCityNumber >= 120001 && otherCityNumber <= 180000){
		$('.otherIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerDay');
	}else{
		$('.otherIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerNight');
	}

	// get value of users choice and compare that with the business if 
	const usersChoice = $("select").val();
	if(usersChoice === 'personal'){
		// if personal is selected run personal if statement 
		if(otherCityNumber >= 80000 && otherCityNumber <= 230000){
			let $messageBox = $("<div class='resultMessageBox'><p>What are you waiting for? Call them!</p></div>");
			$('.resultMessage').html($messageBox);
		} else {
			let $messageBox = $("<div class='resultMessageBox'><p>They're probably asleep ...</p></div>");
			$('.resultMessage').html($messageBox);
		}
	}else if(usersChoice === 'business'){
	// if business is selected run business if statement 
		if(otherCityNumber >= 70000 && otherCityNumber <= 180000){
			let $messageBox = $("<div class='resultMessageBox'><p>Give them a call!</p></div>");
			$('.resultMessage').html($messageBox);
		} else {
			let $messageBox = $("<div class='resultMessageBox'><p>Try again later! They can't be working all day ...</p></div>");
			$('.resultMessage').html($messageBox);
		}
	}else if (usersChoice === 'general'){
		//no message will be shown 
	}else{
		console.log('error');
	}
}

// get the latitude and longitude from the geolocation API 
// when the request come back enter that value into the parameter in the timezone app:
// GEOLOCATION AJAX CALL
app.getLatLng = function(city){
	return $.ajax({
		url: app.locationURL,
		type:'GET',
		dataType:'json',
		data:{
			key: app.key,
			address: city 
			}
	});
}

// TIMEZONE AJAX CALL
const ajaxTimeCall = function(appPosition){
	//used proxy to fight CORS issue
	return $.ajax({
	    url: 'http://proxy.hackeryou.com',
	    dataType: 'json',
	    method:'GET',
	    data: {
	        reqUrl: app.timezoneURL,
	        params: {
	            key:app.key,
				timestamp:1331161200,
				location: appPosition
	        },
	        xmlToJSON: false
	    }
	});
};

// reloads the page when button is clicked
// app.checkAnother = 
function reset(){
	location.reload();
};

$('button.checkAnother').on('click', function(e){
	e.preventDefault();
	reset();
});

// doc ready:
$(function(){
	app.init();
});