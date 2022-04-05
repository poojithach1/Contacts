
let contactListArray= [];
let currentEditContactId = null;


function saveContactsInStorage(contactlist) {
    localStorage.setItem('contactlist',JSON.stringify(contactlist));
}

function loadContactsFromStorage() {
    return JSON.parse(localStorage.getItem("contactlist")) || [];
}


function showAddContactPopup() {
   let addContact=document.getElementById('add-contact-popup');
   addContact.classList.remove('hideList');
   addContact.reset();
}

function onSubmitCreateContact(e) {
    e.preventDefault();
    let firstName=document.getElementById("add-contact-popup-firstname").value;
    let lastName=document.getElementById("add-contact-popup-lastname").value;
    let email=document.getElementById("add-contact-popup-email").value;
    let phone=document.getElementById("add-contact-popup-phone").value;
    let id=randomString(8);
    let user= {
        firstName,
        lastName,
        email,
        phone,
        id
    };
    contactListArray.push(user);
    saveContactsInStorage(contactListArray);
    formClose();
    renderContactList(contactListArray);
}

function renderContactList(list) {
    const innerhtml = list.map(({id, lastName, firstName}) => {
        return `<li id=${id}>${firstName} ${lastName}
            <button class="li-button">&#10060;</button>
            <button class="li-button">&#9997;</button>
        </li>`
    }).join('');
    document.getElementById("contacts-ul").innerHTML = innerhtml;
}

function formClose() {
    let contact=document.getElementById('add-contact-popup');
   contact.classList.add('hideList');
   }

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function onClickContactsList(event) {
    event.stopPropagation();
    event.preventDefault();
    let target=event.target;
    target.type;
    if(target.nodeName==='LI'){
        let key=contactListArray.find(user=>user.id==target.id);
        let index=contactListArray.indexOf(key);
        let contact=contactListArray[index];
        alert(`
        FirstName: ${contact.firstName}
        LastName: ${contact.lastName}
        Email: ${contact.email}
        PhoneNumber: ${contact.phone}
        `);
    }
    if(target.nodeName==='BUTTON'){
        if(target.textContent==='❌'){
            const li=target.closest('li');
            const selectedId = li.id;
            if(confirm("Are you sure you want to delete?")===true) {
                contactListArray = contactListArray.filter(({id}) => id !== selectedId);
                li.remove();
                saveContactsInStorage(contactListArray);
                renderContactList(contactListArray);
            }
        }else {
            const li=target.closest('li');
            const selectedId = li.id;
            const contact = contactListArray.find(user=>user.id === selectedId);
            showEditContactPopup(contact);
        }
    }
}

function showEditContactPopup(contact) {
    let editContact = document.getElementById('edit-contact-popup');
    setEditPopupDomValues(contact);
    editContact.classList.remove('hideList');
}

function setEditPopupDomValues(contact) {
    const {id, firstName, lastName, email, phone } = contact;
    document.getElementById("edit-contact-popup-firstname").value = firstName;
    document.getElementById("edit-contact-popup-lastname").value = lastName;
    document.getElementById("edit-contact-popup-email").value = email;
    document.getElementById("edit-contact-popup-phone").value = phone;
    document.getElementById("edit-contact-popup-submit-button").contactId = id;
}

function clearEditPopupDomValues() {
    document.getElementById("edit-contact-popup-firstname").value = "";
    document.getElementById("edit-contact-popup-lastname").value = "";
    document.getElementById("edit-contact-popup-email").value = "";
    document.getElementById("edit-contact-popup-phone").value = "";
    document.getElementById("edit-contact-popup-submit-button").contactId = "";
}

function onSubmitEditPopup(){
    let firstName=document.getElementById("edit-contact-popup-firstname").value;
    let lastName=document.getElementById("edit-contact-popup-lastname").value;
    let email=document.getElementById("edit-contact-popup-email").value;
    let phone=document.getElementById("edit-contact-popup-phone").value;
    let id = document.getElementById("edit-contact-popup-submit-button").contactId;
    let updatedContact = {
        firstName,
        lastName,
        email,
        phone,
        id
    }
    const currentContactIndex = contactListArray.findIndex(user=>user.id === id);
    contactListArray[currentContactIndex] = updatedContact;
    console.log(contactListArray);
    saveContactsInStorage(contactListArray);
    formClose();
}

function displyContactList(){
    let searchInput=document.getElementById('search-input').value;
    // let contactListArray=contactListArray.filter(Obj =>Obj.firstName.includes(searchInput) || Obj.lastName.includes(searchInput) );
     let search=findContact(searchInput,contactListArray);
    renderContactList(search);
}

function findContact(wordToMatch, list) {
    return list.filter(obj => {
       const regex = new RegExp(wordToMatch, 'gi' );
       return obj.firstName.match(regex) || obj.lastName.match(regex)
    });
 }

function init() {
   const searchInput=document.getElementById('search-input');
   const addButton=document.getElementById('add-button');
   const submit=document.getElementById('add-contact-popup-submit-button');
   const submitEditContact=document.getElementById('edit-contact-popup-submit-button')
   const contactsUl = document.getElementById('contacts-ul');
   addButton.addEventListener('click', showAddContactPopup);
   submitEditContact.addEventListener('click',onSubmitEditPopup)
   submit.addEventListener('click', onSubmitCreateContact);
   contactsUl.addEventListener('click', onClickContactsList);
   searchInput.addEventListener('keydown',displyContactList)
    contactListArray = loadContactsFromStorage();
    renderContactList(contactListArray);
}

init();

