// function files() {
//     document.getElementById('app-frame').src = 'apps/files.html'
//     document.getElementById('apps').className = 'open'
// }

// function email() {
//     document.getElementById('app-frame').src = 'apps/email.html'
//     document.getElementById('apps').className = 'open'
// }

// function closeApps() {
//     document.getElementById('apps').className = 'closed'
//     console.log('e')
// }

i = 0
function makenewwindow(window) {
    let newwindow = `<div class="draggableDiv" id="floatingwindow${i}">
                        <div class="topnav"></div>
                        <iframe class="appframe" src="${window}" frameborder="0"></iframe>
                        <div class="resizer bottom-right-resize" id="resizer${i}"></div>
                    </div>`
                    document.getElementById('windowcontainer').innerHTML += newwindow
                    makeDraggable(`floatingwindow${i}`)
                    makeResizable(`floatingwindow${i}`, `resizer${i}`)
    i++

    
}