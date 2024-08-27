import { createElement } from "./elements.js"

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

const fetchPosts = async () => {
    const response = await fetch('http://localhost:3333/posts')
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
    await fetch ('http://localhost:3333/posts', {
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
    
     await fetch (`http://localhost:3333/posts/${id}`, {
        method:'DELETE'
     })
    window.location.reload(true);
    const aside = document.querySelector('#Aside')
    aside.innerHTML = ''
    loadPosts()
}

const smallPost = (post) => {
    const { title, author, picture} = post

    const divPost = createElement('div','post')
    const divImg = createElement('div','img')
    const img = createElement('img')
    const postTitle = createElement('h3','', title)
    const divAuthor = createElement('div','author')
    const authorTitle= createElement('h4','','Author:')
    const paragAuthor = createElement('p','',author)
    const divMorePost = createElement('div','MorePostBtn')
    const MoreBtn = createElement('button','',"View More...")

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
    const {id, title, author,content, picture, codigo} = post

    const aside = document.querySelector('#Aside')
    const divExtendedPost = createElement('div','postExtended')
    const titleExtend = createElement('h2','', title)
    const divExtendedAuthor = createElement('div','authorExtended')
    const authorTitle = createElement('h3','','Author:')
    const paragAuthor = createElement('p','', 'author')
    const divContent = createElement('div','content')
    const contentParagraph = createElement('p','','content')
    const divImage = createElement('div','img')
    const img = createElement('img',)
    const divIcons = createElement('div','ToolsPostIcons')
    const iconClose = createElement('i','fa-solid')
    const iconUp = createElement('i','fa-solid fa-pen')
    const iconDel = createElement('i','fa-solid fa-trash')
    const divSaveBtn = createElement('div','divSaveBtn')
    const SaveUpBtn = createElement('button','SaveUpBtn','Save')

    iconClose.classList.add('fa-x')
    iconUp.classList.add('fa-pen')
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
        const ID = parseInt(prompt('Digite seu ID para excluir POST:'))

        if(ID == codigo){
            deletePost(id)
        }else{
            alert('ID incorreto ou invalido')
        }
    })

    const EditInputTitle = createElement('input','INPUTS')
    const EditInputAuthor = createElement('input','INPUTS')
    const EditInputContent = createElement('textarea','TEXTAREA')
    const labelImg = createElement('label','picture')
    
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

