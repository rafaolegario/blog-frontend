const createElement = (tag, classe, innerText = '', innerHTML = '') =>{
    const element = document.createElement(tag)
    
    if(classe !== ''){
        element.classList.add(classe) 
    }
    if(innerText){
        element.innerText = innerText
    }

    if(innerHTML){
        element.innerHTML = innerHTML
    }

    return element
}

export {
    createElement
}