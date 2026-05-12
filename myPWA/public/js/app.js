if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("js/serviceworker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

//changing popup data to specific item clicked
function appendData(obj_index) {
  fetch(`/devices`)
              .then(res => res.json())
              .then(devices => {
                const device = devices.find(d => d.obj_index === Number(obj_index));
                const {image, device_name, year, brand, type, colour, description} = device;
                //data obtained is added to the relevant popup text fields
                  document.getElementById("rightpopup").innerHTML = `
                    <h2 class="name">${device_name}</h2>
                    <p class="brand">${brand}</p>
                    <p class="year">${year}</p>
                    <p class="type">${type}</p>
                    <p class="colour">${colour}</p>
                    <p class="about">${description}</p>
                  `;
                // image assigned to image div
                  document.getElementById("leftpopup").innerHTML = `
                    <img src="/${image}" alt="Device image">
                  `;
                });
}


const open_buttons = document.getElementsByClassName('object')
for (let btn of open_buttons) {
  //open popup on click
  btn.addEventListener('click', function() {
    //get the id of the clicked button
    popup_func(this.id); 
  }); 
}

// adding object data to popup and revealing it
function popup_func(item_id) {
  appendData(item_id);
  //displays popup
  document.getElementById('popup_win').style.visibility = 'visible'
  // prevent page from scrolling
  document.body.style.overflow = 'hidden';
  //blur body of site
  document.getElementById('blur_body').style.filter = 'blur(5px)' 
}

//close popup
const close_btn = document.getElementById('popup_close');
//on click close popup
close_btn.addEventListener('click', close_popup_func);

function close_popup_func() {
  //hide popup
  document.getElementById('popup_win').style.visibility = 'hidden' 
  // allow scroll again
  document.body.style.overflow = 'visible'; 
  //unblur body
  document.getElementById('blur_body').style.filter = 'blur(0px)' 
}


// need to add appendData() somewhere to append the data changes 
const object_order_default = [1,2,3,4,5,6,7,8,9,10]; //dunno if relevant
const device_objects = document.getElementsByClassName('object');

// function hides all device objects and then unhides as per default array
function reset_objects () {
  for (var i = 0; i < device_objects.length; i++) {
  device_objects[i].style.visibility = "hidden";
  }
  for (var i = 0; i < object_order_default.length; i++) {
    device_objects[i].style.visibility = "visible";
  }
}

// function to sort objects
function sort_by (selected_option) {
  //hide all the objects
  for (var i = 0; i < device_objects.length; i++) {
    device_objects[i].style.display = "none";
  }

  if (selected_option === "alphabetical") {
  // fetch json
    fetch("/sort_alphabet")
    .then(response => response.json ())
    .then(data => {
      // access device object div
      const container = document.querySelector(".device_objects");
      data.forEach((obj) => {
        // move each object to the end of div to sort
        const dev = document.getElementById(obj.obj_index);
        container.appendChild(dev);
        dev.style.display="block";
      });
    })
  // same process for other sorting options
  } else if (selected_option === "reverse") {
    fetch("/sort_rev_alphabet")
    .then(response => response.json ())
    .then(data => {
      const container=document.querySelector(".device_objects");
      data.forEach((obj) => {
        const dev = document.getElementById(obj.obj_index);
        container.appendChild(dev);
        dev.style.display="block";
      });
    })
  } else if (selected_option === "increase") {
    fetch("/sort_year")
    .then(response => response.json ())
    .then(data => {
      const container=document.querySelector(".device_objects");
      data.forEach((obj) => {
        const dev = document.getElementById(obj.obj_index);
        container.appendChild(dev);
        dev.style.display="block";
      });
    })
  } else if (selected_option === "decrease") {
    fetch("/sort_rev_year")
    .then(response => response.json ())
    .then(data => {
      const container=document.querySelector(".device_objects");
      data.forEach((obj) => {
        const dev = document.getElementById(obj.obj_index);
        dev.style.display="block";
        container.appendChild(dev);
      });
    })
  };
}

// Listening for sort button to change 
document.getElementById("sort_popup").addEventListener("change", function() {
  // get the sort type
  const selectedId = this.options[this.selectedIndex].id;
  // call relevant sort
  sort_by(selectedId);
});
