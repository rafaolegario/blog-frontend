const PostOrganization = document.querySelector('.PostOrganization')
const addPostBtn = document.querySelector('.CreatePostbtn')
const cancelPostBtn = document.querySelector('.red')
const Form = document.querySelector('#formNewPost')
const pictureImage = document.querySelector('.picture_image')
const InputTitle = document.querySelector('#title')
const InputAuthor = document.querySelector('#author')
const InputPicture = document.querySelector('#imgFile')
const InputContent = document.querySelector('#content')
let imageResult;
let UserCodeID;

pictureImage.innerHTML = 'CHOOSE AN IMAGE'
InputPicture.addEventListener('change', (e) =>{
    const inputTarget = e.target

    const file = inputTarget.files[0]

    if(file){
        const reader = new FileReader()

        reader.addEventListener('load', (e) =>{
            imageResult = e.target.result
            const img = document.createElement('img')
            img.classList.add('picture_img')
            img.src = imageResult
            pictureImage.innerHTML =''
            pictureImage.appendChild(img)
            
        })
        
        reader.readAsDataURL(file)

    }else{
        pictureImage.innerHTML = 'Choose an image'
    }
})

const fetchPosts = async (event) => {
    const response = await fetch('https://blog-backend-production-2377.up.railway.app/posts')
    const posts = await response.json()
    return posts
}

const addPost = async (event) =>{

    event.preventDefault()
    const post = {
        title: InputTitle.value,
        author: InputAuthor.value,
        content: InputContent.value,
        picture: imageResult
    }
    await fetch ('https://blog-backend-production-2377.up.railway.app/posts', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(post)
    })
    
    await loadPosts()
    alert(`Seu ID: ${UserCodeID}. Guarde seu ID caso queria DELETAR ou ATUALIZAR seu POST`)
    Form.reset()
    const newPost = document.querySelector('.NewPost')
    newPost.style.display = "none"
    pictureImage.innerHTML = 'CHOOSE AN IMAGE'
}

const updatePost = async ({ID, title, author, content, picture}) =>{

    await fetch (`http://localhost:3333/posts/${ID}`, {
        method:'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, author, content, picture})
        
    })
    window.location.reload(true);
    loadPosts()
    const aside = document.querySelector('#Aside')
    aside.innerHTML = ''
    alert('POST ATUALIZADO COM SUCESSO')
    
}

const deletePost = async (id) => {
    
     await fetch (`https://blog-backend-production-2377.up.railway.app/posts/${id}`, {
        method:'DELETE'
     })
    window.location.reload(true);
    const aside = document.querySelector('#Aside')
    aside.innerHTML = ''
    loadPosts()
}

const createElement = (tag, innerText = '', innerHTML = '') =>{
    const element = document.createElement(tag)
    
    if(innerText){
        element.innerText = innerText
    }

    if(innerHTML){
        element.innerHTML = innerHTML
    }

    return element
}

const smallPost = (post) => {
    const {ID, title, author, picture} = post

    const divPost = createElement('div')
    const divImg = createElement('div')
    const img = createElement('img')
    const postTitle = createElement('h3')
    const divAuthor = createElement('div')
    const authorTitle= createElement('h4')
    const paragAuthor = createElement('p')
    const divMorePost = createElement('div')
    const MoreBtn = createElement('button')

    divPost.classList.add('post')
    divImg.classList.add('img')
    divAuthor.classList.add('author')
    divMorePost.classList.add('MorePostBtn')
    img.src = picture
    postTitle.innerText = title
    authorTitle.innerText = 'Author:'
    paragAuthor.innerText = author
    MoreBtn.innerText = "View More..."

    

    divImg.append(img)
    divAuthor.append(authorTitle, paragAuthor)
    divMorePost.append(MoreBtn)

    divPost.append(divImg, postTitle, divAuthor, divMorePost)

    MoreBtn.addEventListener('click', () => {
        postExtended(post)
        const newPost = document.querySelector('.NewPost')
        newPost.style.display = "none"
        scrollToExtendedPost()
        
    })
    
    return divPost 
}

const postExtended = (post) =>{
    const {ID, title, author,content, picture, codigo} = post
    const aside = document.querySelector('#Aside')
    const divExtendedPost = createElement('div')
    const titleExtend = createElement('h2')
    const divExtendedAuthor = createElement('div')
    const authorTitle = createElement('h3')
    const paragAuthor = createElement('p')
    const divContent = createElement('div')
    const contentParagraph = createElement('p')
    const divImage = createElement('div')
    const img = createElement('img')
    const divIcons = createElement('div')
    const iconClose = createElement('i')
    const iconUp = createElement('i')
    const iconDel = createElement('i')
    const divSaveBtn = createElement('div')
    const SaveUpBtn = createElement('button')
    
    divSaveBtn.classList.add('divSaveBtn')
    SaveUpBtn.innerText = 'Save'
    SaveUpBtn.classList.add('SaveUpBtn')
    divIcons.classList.add('ToolsPostIcons')
    divExtendedPost.classList.add('postExtended')
    divExtendedAuthor.classList.add('authorExtended')
    divContent.classList.add('content')
    divImage.classList.add('img')
    titleExtend.innerText = title
    authorTitle.innerText = 'Author:'
    paragAuthor.innerText = author
    contentParagraph.innerText = content
    img.src = picture
    iconClose.classList.add('fa-solid')
    iconClose.classList.add('fa-x')
    iconUp.classList.add('fa-solid')
    iconUp.classList.add('fa-pen')
    iconDel.classList.add('fa-solid')
    iconDel.classList.add('fa-trash')


    aside.innerHTML = ''
    
    divIcons.append(iconClose, iconUp, iconDel)
    divExtendedAuthor.append(authorTitle, paragAuthor)
    divContent.append(contentParagraph)
    divSaveBtn.append(SaveUpBtn)
    divImage.append(img)
    divExtendedPost.append(titleExtend, divExtendedAuthor, divContent,divSaveBtn, divImage)
    aside.appendChild(divExtendedPost)
    aside.appendChild(divIcons)

    const PostOrganization = document.querySelector('.PostOrganization')
    
    PostOrganization.innerHTML = ''

    iconClose.addEventListener('click', () =>{
        aside.innerHTML = ''
        loadPosts()
    })

    iconDel.addEventListener('click', () =>{
        const id = parseInt(prompt('Digite seu ID para excluir POST:'))

        if(id == codigo){
            deletePost(ID)
        }else{
            alert('ID incorreto ou invalido')
        }
    })

    const EditInputTitle = createElement('input')
    const EditInputAuthor = createElement('input')
    const EditInputContent = createElement('textarea')

    EditInputAuthor.classList.add('INPUTS')
    EditInputTitle.classList.add('INPUTS')
    EditInputContent.classList.add('TEXTAREA')

    const labelImg = createElement('label')
    labelImg.classList.add('picture')
    labelImg.append(InputPicture,pictureImage)

    EditInputTitle.value = title
    EditInputAuthor.value = author
    EditInputContent.value = content
    pictureImage.innerHTML = 'If you want the same image, do not use this field'
   iconUp.addEventListener('click', () =>{
        divExtendedPost.style.width = '80%'
        SaveUpBtn.style.display = 'flex'
        titleExtend.innerHTML = ''
        titleExtend.append(EditInputTitle)
        paragAuthor.innerHTML = ''
        paragAuthor.append(EditInputAuthor)
        contentParagraph.innerHTML = ''
        contentParagraph.append(EditInputContent)
        divImage.innerHTML = ''
        divImage.append(labelImg)

    })
  
   SaveUpBtn.addEventListener('click', () =>{
    const id = parseInt(prompt('Digite seu ID para excluir POST:'))

    if(id === codigo){
        updatePost({ID, title: EditInputTitle.value, author:EditInputAuthor.value, content:EditInputContent.value, picture:imageResult ? imageResult : picture})
    }else{
        alert('ID incorreto ou invalido')
    }
    
   
   })

    return divExtendedPost 
}

const loadPosts = async () => {
    const posts = await fetchPosts()
    
    PostOrganization.innerHTML = ''

    posts.forEach((post) => {
      const {codigo} = post
        const divPost = smallPost(post)
        PostOrganization.appendChild(divPost)
        UserCodeID = codigo
    });
}

addPostBtn.addEventListener('click', () =>{
    
    const newPost = document.querySelector('.NewPost')
    newPost.style.display = "flex"
    const aside = document.querySelector('#Aside')
    aside.innerHTML = ''
  
})

cancelPostBtn.addEventListener('click', () =>{
   
    const newPost = document.querySelector('.NewPost')
    newPost.style.display = "none"
    pictureImage.innerHTML = 'Choose an image'

    InputTitle.value = ''
    InputAuthor.value = ''
    InputPicture.value = '' 
    InputContent.value = ''
})


Form.addEventListener('submit',  addPost)


loadPosts()

//scroll area

function scrollToExtendedPost(){
    window.scrollBy({top: document.querySelector('#Aside').scrollHeight, behavior: "smooth"})
}

