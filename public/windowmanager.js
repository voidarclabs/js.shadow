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
icondict['files'] = '<img class="appicon" src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png" alt=""></img>'
icondict['email'] = '<img class="appicon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mail_%28iOS%29.svg/2048px-Mail_%28iOS%29.svg.png" alt=""></img>'
icondict['safari'] = '<img class="appicon" src="https://i.pinimg.com/originals/98/14/6e/98146ec63f05240c321a82f8b35a31c0.png" alt=""></img>'

function makenewwindow(window, appname) {
    let newwindow = `<div class="draggableDiv" id="floatingwindow${i}">
                        <div class="topnav">
                            <div onclick="deletewindow('${i}')" id="topnavexit"><i class="fa-solid fa-xmark"></i></div>
                            <div onclick="minimisewindow('${i}')" id="topnavminimise"><i class="fa-solid fa-minus"></i></div>
                            <div onclick="maximisewindow('${i}')" id="topnavmaximise"><i class="fa-solid fa-maximize"></i></div>
                        </div>
                        <div id=appname>${icondict[appname]}</div>
                        <iframe is="x-frame-bypass" class="appframe" src="${window}" frameborder="0"></iframe>
                        <div class="resizer bottom-right-resize" id="resizer${i}"></div>
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
  const minimisedwindow = document.getElementById(`floatingwindow${window}`)
  minimisedwindow.style.minHeight = '0'
  minimisedwindow.style.minWidth = '0'
  minimisedwindow.style.height = '0'
  minimisedwindow.style.width = '0'
}