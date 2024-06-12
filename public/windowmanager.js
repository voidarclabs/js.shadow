let i = 0;

document.addEventListener('mousedown', function (e) {
  const target = e.target.closest('.draggableDiv');
  if (target) {
    const resizer = target.querySelector('.resizer');
    makeResizableAndDraggable(target, resizer);
    handleMouseDown(target, e);
  }
});

document.addEventListener('mousemove', function (e) {
 // handleMouseMove(e);
});

document.addEventListener('mouseup', function () {
  handleMouseUp();
});

function handleMouseDown(element, e) {
  element.isDragging = true;
  element.isResizing = false;

  const offsetX = e.clientX - element.getBoundingClientRect().left;
  const offsetY = e.clientY - element.getBoundingClientRect().top;

  bringToFront(element);

  if (e.target.classList.contains('resizer')) {
    element.isResizing = true;
    element.resizeHandle = e.target;
    element.originalMouseX = e.clientX;
    element.originalMouseY = e.clientY;
    element.originalWidth = element.offsetWidth;
    element.originalHeight = element.offsetHeight;
  }

  element.offsetX = offsetX;
  element.offsetY = offsetY;
}

function handleMouseUp() {
  const allDivs = document.querySelectorAll('.draggableDiv');
  allDivs.forEach(element => {
    element.isDragging = false;
    element.isResizing = false;
  });
}

function bringToFront(element) {
  const allDivs = document.querySelectorAll('.draggableDiv');
  allDivs.forEach(div => {
    div.style.zIndex = 0;
  });

  element.style.zIndex = 1;
}

function hideframe(resizerId) {
  const frameId = resizerId.replace('resizer', '');
  const frame = document.getElementById(`floatingwindow${frameId}`).querySelector('.appframe');

  if (frame) {
    if (frame.style.display !== 'none') {
      frame.style.display = 'none';
    }
  }
}



function makeResizableAndDraggable(element, resizer) {
    let isResizing = false;
    let originalMouseX, originalMouseY, originalWidth, originalHeight, initialTop, initialLeft, offsetX, offsetY;
  
    resizer.addEventListener('mousedown', function (e) {
      isResizing = true;
      originalMouseX = e.clientX;
      originalMouseY = e.clientY;
      originalWidth = element.offsetWidth;
      originalHeight = element.offsetHeight;
      initialTop = element.offsetTop;
      initialLeft = element.offsetLeft;
  
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  
    element.addEventListener('mousedown', function (e) {
      element.isResizing = false;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
  
      bringToFront(element);
      hideIframeDuringDrag(element);
  
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  
    function handleMouseMove(e) {
      if (isResizing) {
        const deltaX = e.clientX - originalMouseX;
        const deltaY = e.clientY - originalMouseY;
  
        const newWidth = Math.max(originalWidth + deltaX, 100);
        const newHeight = Math.max(originalHeight + deltaY, 100);
  
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
  
        // Maintain the initial top and left styles
        element.style.top = initialTop + 'px';
        element.style.left = initialLeft + 'px';
      } else if (element.isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
  
        element.style.left = x + 'px';
        element.style.top = y + 'px';
      }
    }
  
    function handleMouseUp() {
      isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
  
      // Show the iframe when resizing or dragging stops
      showIframe(element);
    }
  
    function bringToFront(element) {
      const allDivs = document.querySelectorAll('.draggableDiv');
      allDivs.forEach(div => {
        div.style.zIndex = 0;
      });
  
      element.style.zIndex = 1;
    }
  

    function hideIframeDuringDrag(element) {
        const frame = element.querySelector('.appframe');
        if (frame) {
          frame.classList.add('hidden');
        }
      }
      
      function showIframe(element) {
        const frame = element.querySelector('.appframe');
        if (frame) {
          frame.classList.remove('hidden');
        }
      }
  }

let icondict = {}
icondict['files'] = '<img draggable="false" class="appicon" src="imgs/files.png" alt=""></img>'
icondict['email'] = '<img draggable="false" class="appicon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mail_%28iOS%29.svg/2048px-Mail_%28iOS%29.svg.png" alt=""></img>'
icondict['safari'] = '<img draggable="false" class="appicon" src="imgs/safari.png" alt=""></img>'

function makenewwindow(window, appname) {
    let newwindow = `<div class="draggableDiv" id="floatingwindow${i}">
                        <div class="topnav" id='topnav${i}'>
                            <div onclick="deletewindow('${i}')" id="topnavexit"><i class="fa-solid fa-xmark"></i></div>
                            <div onclick="minimisewindow('${i}')" id="topnavminimise"><i class="fa-solid fa-minus"></i></div>
                            <div onclick="maximisewindow('${i}')" id="topnavmaximise"><i class="fa-solid fa-maximize"></i></div>
                        </div>
                        <div class='appname' id='appname${i}'>${icondict[appname]}</div>
                        <iframe id='appframe${i}' is="x-frame-bypass" class="appframe" src="${window}" frameborder="0"></iframe>
                        <div class="resizer bottom-right-resize" id="resizer${i}"></div>
                        <div class="unmin" id="unmin${i}" onclick="minimisewindow('${i}')"><i id="unminicon${i}" class="fa-solid fa-minus unminicon"></div>
                    </div>`;
  document.getElementById('windowcontainer').innerHTML += newwindow;

  const floatingwindow = document.getElementById(`floatingwindow${i}`);
  const resizer = document.getElementById(`resizer${i}`);

  makeResizableAndDraggable(floatingwindow, resizer);
  i++;
}

function deletewindow(window) {
    let deletedwindow = document.getElementById(`floatingwindow${window}`)
    deletedwindow.style.transition = 'all 0.1s'
    deletedwindow.style.opacity = '0'
    setTimeout(() => {
          deletedwindow.remove()
    }, 200);

}

function maximisewindow(window) {
    const maximisedwindow = document.getElementById(`floatingwindow${window}`)
    if (maximisedwindow.classList.contains('max')) {
        
        maximisedwindow.style.top = '20px'
        maximisedwindow.style.left = '20px'
        maximisedwindow.style.height = '450px'
        maximisedwindow.style.width = '625px'
        maximisedwindow.classList.remove('max')
        setTimeout(() => {
            maximisedwindow.style.transition = ''
        }, 100);

    } else {
    maximisedwindow.style.transition = 'all 0.2s'
    maximisedwindow.style.top = 0
    maximisedwindow.style.left = 0
    maximisedwindow.style.height = '100%'
    maximisedwindow.style.width = '100%'
    maximisedwindow.classList.add('max')
}}



function minimisewindow(window) {
  const minimisedwin = document.getElementById(`floatingwindow${window}`)
  const miniframe = document.getElementById(`appframe${window}`)
  const miniappname = document.getElementById(`appname${window}`)
  const miniresizer = document.getElementById(`resizer${window}`)
  const unmin = document.getElementById(`unmin${window}`)
  const unminicon = document.getElementById(`unminicon${window}`)
  const minitopbar = document.getElementById(`topnav${window}`)

  if (minimisedwin.classList.contains('min')) {
    minimisedwin.classList.remove('min')
    setTimeout(() => {
      minimisedwin.style.transition = ''
    }, 100);
    minitopbar.style.height = ''
    miniresizer.style.height = ''
    minimisedwin.style.minHeight = ''
    minimisedwin.style.minWidth = ''
    minimisedwin.style.height = ''
    minimisedwin.style.width = ''
    miniappname.style.height = ''
    miniframe.style.display = ''
    unmin.style.display = ''
    unminicon.style.display = ''
    if (minimisedwin.classList.contains('max')) {
      minimisedwin.classList.remove('max')
    }
  } else {
    minimisedwin.classList.add('min')
    minimisedwin.style.transition = 'height 0.1s, width 0.1s'
    minitopbar.style.height = 0
    miniresizer.style.height = 0
    minimisedwin.style.minHeight = '0'
    minimisedwin.style.minWidth = '0'
    minimisedwin.style.height = '70px'
    minimisedwin.style.width = '70px'
    miniappname.style.height = '100%'
    miniframe.style.display = 'none'
    unmin.style.display = 'flex'
    unminicon.style.display = 'block'
    if (minimisedwin.classList.contains('max')) {
      minimisedwin.classList.remove('max')
    }
  }

}

let appslist = {}
appslist['files'] = `apps/files.html`
appslist['email'] = `apps/email.html`
appslist['safari'] = `https://www.google.com/search?igu=1`

function generateapp(appname) {
  let newapp = 
  `<div id='app-desktop-${appname}' onclick='makenewwindow("${appslist[appname]}", "${appname}")' class='app-desktop'>
    <div class='appicon-desktop'>${icondict[appname]}</div>
    <div class='appname-desktop'>${appname}</div>
    <div id='resizer-desktop-${appname}' class='resizer-desktop'></div>
  </div>`

  document.getElementById('appcontainer').innerHTML += newapp;
}

window.onload=function(){
  generateapp('files')
  generateapp('email')
  generateapp('safari')
}

document.oncontextmenu = rightClick; 
  
document.onclick = hideMenu;
document.oncontextmenu = rightClick; 
  
function hideMenu() { 
  setTimeout(() => {
    document.getElementById("contextMenu") 
      .style.display = "none" 
  }, 50);

} 

function rightClick(e) { 
    e.preventDefault(); 

    if (document.getElementById("contextMenu") 
            .style.display == "block") 
          setTimeout(() => {
            hideMenu(); 
          }, 10);

    else{ 
        var menu = document.getElementById("contextMenu") 

        menu.style.display = 'block'; 
        menu.style.left = e.pageX + "px"; 
        menu.style.top = e.pageY + "px"; 
    } 
} 