import svgs from "../js/icons.js";

let clientsList = [];

let sortColumnFlag = 'id',
    sortDirFlag = true;

const $tableBody = document.getElementById('tbody');

//Получение hash клиента и открытие данных о клиенте по ссылке в отдельном окне
window.addEventListener('load', () => {
  if (window.location.hash) {
    createModalForm(
      async function(modal, content, closeBtn){
        let changeTitle = document.createElement('h3'),
            changeForm = document.createElement('form'),
            changeLabelName = document.createElement('label'),
            changeLabelSurname = document.createElement('label'),
            changeLabeLastName = document.createElement('label'),
            changeInputName = document.createElement('input'),
            changeInputSurname = document.createElement('input'),
            changeInputLastName = document.createElement('input'),
            changeContactsBlock = document.createElement('div'),
            changeContactsList = document.createElement('div'),
            changeContactsBtn = document.createElement('button'),
            changeBtnSave = document.createElement('button'),
            changeBtnDelete = document.createElement('button');
    
            changeTitle.textContent = 'Изменить данные'
            changeLabelName.textContent = 'Имя*'
            changeLabelSurname.textContent = 'Фамилия*'
            changeLabeLastName.textContent = 'Отчество'
            changeContactsBtn.textContent = 'Добавить контакт'
            changeBtnSave.textContent = 'Сохранить'
            changeBtnDelete.textContent = 'Удалить клиента'
    
            changeTitle.classList.add('modal__title')
            changeForm.classList.add('form')
            changeInputName.classList.add('input')
            changeInputSurname.classList.add('input')
            changeInputLastName.classList.add('input')
            changeContactsBlock.classList.add('contacts__block')
            changeContactsBtn.classList.add('contacts__btn')
            changeBtnSave.classList.add('btn__save')
            changeBtnDelete.classList.add('btn__cancel')

            console.log(Number(window.location.hash.substring(1)));
            console.log(await serverGetClient(Number(window.location.hash.substring(1))));

            let oneUser = await serverGetClient(Number(window.location.hash.substring(1)))
      
            changeInputName.value = oneUser.name
            changeInputSurname.value = oneUser.surname
            changeInputLastName.value = oneUser.lastName

            for (let contact of oneUser.contacts) {

              const contactItem = document.createElement('div'),
                    contactSelect = document.createElement('select'),
                    optionPhone = document.createElement('option'),
                    optionEmail = document.createElement('option'),
                    optionFacebook = document.createElement('option'),
                    optionVk = document.createElement('option'),
                    optionOther = document.createElement('option'),
                    contactsInput = document.createElement('input'),
                    contactItemDelete = document.createElement('button');

                    optionPhone.textContent = 'Телефон'
                    optionEmail.textContent = 'Email'
                    optionFacebook.textContent = 'Facebook'
                    optionVk.textContent = 'Vk'
                    optionOther.textContent = 'Другое'

                    contactItem.classList.add('contacts__item')
                    contactSelect.classList.add('contacts__select')
                    contactsInput.classList.add('contacts__input')
                    contactItemDelete.classList.add('contacts__cancel')
                    changeContactsBtn.classList.add('contacts__btn-add')

                    contactSelect.append(optionPhone, optionEmail, optionFacebook, optionVk, optionOther)
                    contactItem.append(contactSelect, contactsInput, contactItemDelete)
                    changeContactsList.append(contactItem)

                    contactsInput.value = contact.value
                    contactSelect.value = contact.type

                    const choicess = new Choices(contactSelect, {
                      searchEnabled: false,
                      shouldSort: false,
                      itemSelectText: '',
                      placeholder: true
                    })

                    contactItemDelete.addEventListener('click', function(el) {
                      el.preventDefault()
                      contactItem.remove()
                    })
            }

            //при нажатии "Добавить контакт" появляется поле для заполнения
            changeContactsBtn.addEventListener('click', function(e) {
              e.preventDefault()
    
              const contactItem = document.createElement('div'),
                    contactSelect = document.createElement('select'),
                    optionPhone = document.createElement('option'),
                    optionEmail = document.createElement('option'),
                    optionFacebook = document.createElement('option'),
                    optionVk = document.createElement('option'),
                    optionOther = document.createElement('option'),
                    contactsInput = document.createElement('input'),
                    contactItemDelete = document.createElement('button');
    
                    optionPhone.textContent = 'Телефон'
                    optionEmail.textContent = 'Email'
                    optionFacebook.textContent = 'Facebook'
                    optionVk.textContent = 'Vk'
                    optionOther.textContent = 'Другое'
                    contactsInput.placeholder = 'Введите данные контакта'
    
                    contactItem.classList.add('contacts__item')
                    contactSelect.classList.add('contacts__select')
                    contactsInput.classList.add('contacts__input')
                    contactItemDelete.classList.add('contacts__cancel')
                    changeContactsBtn.classList.add('contacts__btn-add')
    
                    contactSelect.append(optionPhone, optionEmail, optionFacebook, optionVk, optionOther)
                    contactItem.append(contactSelect, contactsInput, contactItemDelete)
                    changeContactsList.append(contactItem)
    
                    const choices = new Choices(contactSelect, {
                      searchEnabled: false,
                      shouldSort: false,
                      itemSelectText: '',
                      placeholder: true
                    })
    
                    contactItemDelete.addEventListener('click', function(el) {
                      el.preventDefault()
                      contactItem.remove()
                    })

                    if (document.querySelectorAll('.contacts__item').length >= 10) {
                      changeContactsBtn.setAttribute('disabled', 'disabled')
                    }
            })


            //по нажатию на кнопку данные из формы о клиенте обновляются
            changeForm.addEventListener('submit', async function(e){
              // e.preventDefault();

              const contactsArr = [];
              const allContacts = document.querySelectorAll('.contacts__item');
              allContacts.forEach(($div) => {
                contactsArr.push({
                  type: $div.querySelector('.contacts__select').value,
                  value: $div.querySelector('.contacts__input').value
                })
              })
    
              const clientUser = {
                name: changeInputName.value.trim(),
                surname: changeInputSurname.value.trim(),
                lastName: changeInputLastName.value.trim(),
                contacts: contactsArr
              }
              
              await serverChangeClient(oneUser.id, clientUser)

              console.log(serverGetClients().then(el => console.log(el)));
  
              modal.remove();

              console.log(contactsArr)
            })
    
            changeBtnDelete.addEventListener('click', function(){
              modal.remove();
            })
    
            changeLabelName.append(changeInputName)
            changeLabelSurname.append(changeInputSurname)
            changeLabeLastName.append(changeInputLastName)
            changeContactsBlock.append(changeContactsBtn, changeContactsList )
            changeForm.append(changeInputName, changeInputSurname, changeInputLastName, changeContactsBlock, changeBtnSave, changeBtnDelete);
            content.append(changeTitle, changeForm);
        }
      );
  }
})


//Создание модального окна
function createModalForm(open, close) {
  const modal = document.createElement('div'),
      modalContent = document.createElement('div'),
      modalCloseBtn = document.createElement('button');

      modal.classList.add('modal');
      modalContent.classList.add('modal__content');
      modalCloseBtn.classList.add('modal-close-btn');

      modalCloseBtn.textContent = 'x';
      modal.id = 'modal';

      modalContent.append(modalCloseBtn);
      modal.append(modalContent);

      open(modal, modalContent, modalCloseBtn);

      modalCloseBtn.addEventListener('click', function() {
        modal.addEventListener('transitionend', () => {
          modal.remove();
        })

        window.location.hash = ''
        
        modal.style.opacity = '0'
      })

      modal.addEventListener('click', (e) => {
        const click = e.composedPath().includes(modalContent)
        if (!click) {
          modal.remove()
        }
      })

      document.body.append(modal);
}



//Открытие модaльного окна по нажатию на кнопку "Добавить клиента"
document.getElementById('clients__btn').addEventListener('click', function() {
 createModalForm(
  function(modal, content, closeBtn){
    let clientsTitle = document.createElement('h3'),
        clientsForm = document.createElement('form'),
        clientsDivName = document.createElement('div'),
        clientsInputName = document.createElement('input'),
        clientsDivSurname = document.createElement('div'),
        clientsInputSurname = document.createElement('input'),
        clientsInputLastName = document.createElement('input'),
        contactsBlock = document.createElement('div'),
        contactsList = document.createElement('div'),
        contactsBtn = document.createElement('button'),
        clientsBtnSave = document.createElement('button'),
        clientsBtnCancel = document.createElement('button'),
        errorBlock = document.createElement('div');

        clientsTitle.textContent = 'Новый клиент'
        clientsForm.id = 'form'
        clientsInputName.placeholder = 'Имя*'
        clientsInputName.setAttribute('data-error', 'Поле Имя не заполнено!')
        clientsInputSurname.placeholder = 'Фамилия*'
        clientsInputSurname.setAttribute('data-error', 'Поле Фамилия не заполнено!')
        clientsInputLastName.placeholder = 'Отчество'
        contactsBtn.textContent = 'Добавить контакт'
        clientsBtnSave.textContent = 'Сохранить'
        clientsBtnCancel.textContent = 'Отмена'

        clientsTitle.classList.add('modal__title')
        clientsForm.classList.add('form')
        clientsDivName.classList.add('box__input')
        clientsInputName.classList.add('input')
        clientsDivSurname.classList.add('box__input')
        clientsInputSurname.classList.add('input')
        clientsInputLastName.classList.add('input')
        clientsBtnSave.classList.add('btn__save')
        clientsBtnCancel.classList.add('btn__cancel')
        contactsBlock.classList.add('contacts__block')
        contactsBtn.classList.add('contacts__btn')
        modal.classList.add('modal-visible')

        

        //при нажатии "Добавить контакт" появляется поле для заполнения
        contactsBtn.addEventListener('click', function(e) {
          e.preventDefault()

          const contactItem = document.createElement('div'),
                contactSelect = document.createElement('select'),
                optionPhone = document.createElement('option'),
                optionEmail = document.createElement('option'),
                optionFacebook = document.createElement('option'),
                optionVk = document.createElement('option'),
                optionOther = document.createElement('option'),
                contactsInput = document.createElement('input'),
                contactItemDelete = document.createElement('button');

                optionPhone.textContent = 'Телефон'
                optionEmail.textContent = 'Email'
                optionFacebook.textContent = 'Facebook'
                optionVk.textContent = 'Vk'
                optionOther.textContent = 'Другое'
                contactsInput.placeholder = 'Введите данные контакта'

                contactItem.classList.add('contacts__item')
                contactSelect.classList.add('contacts__select')
                contactsInput.classList.add('contacts__input')
                contactItemDelete.classList.add('contacts__cancel')
                contactsBtn.classList.add('contacts__btn-add')

                contactSelect.append(optionPhone, optionEmail, optionFacebook, optionVk, optionOther)
                contactItem.append(contactSelect, contactsInput, contactItemDelete)
                contactsList.append(contactItem)

                const choices = new Choices(contactSelect, {
                  searchEnabled: false,
                  shouldSort: false,
                  itemSelectText: '',
                  placeholder: true
                })

                contactItemDelete.addEventListener('click', function(el) {
                  el.preventDefault()
                  contactItem.remove()
                })

                if (document.querySelectorAll('.contacts__item').length >= 10) {
                  contactsBtn.setAttribute('disabled', 'disabled')
                }
        })

        function createError(text) {
            const parent = errorBlock;
            const errorLabel = document.createElement('span');

            errorLabel.classList.add('error-label')
            errorLabel.textContent = text
            parent.classList.add('error')

            parent.append(errorLabel);
          }

         //валидация контактов
        function validationContacts(form) {

          let result = true;
          const allInputsContact = form.querySelectorAll('.contacts__input');

          for (const input of allInputsContact) {
            if (input.value == ''){
              console.log('ошибка контакта')
              createError('Поле контакта не заполнено!')
              result = false
            }
          }
          return result
        }

        //валидация формы
        function validation(form) {
          errorBlock.innerHTML = ''

          function removeError(input) {
            const parent = input.parentNode;

            if (parent.classList.contains('error')) {
              parent.querySelector('.error-label').remove()
              parent.classList.remove('error')
            }
          }

          let result = true;
          const allInputs = form.querySelectorAll('.input');

          for (let i = 0; i < allInputs.length-1; i++) {
            removeError(allInputs[i])
            if (allInputs[i].value == ''){
              console.log('ошибка')
              createError(allInputs[i].dataset.error)
              result = false
            }
          }

          if (!validationContacts(form)) {
            result = false
          }

          return result
        }

       
          //по нажатию на кнопку данные из формы о клиенте добавляются в таблицу
        clientsForm.addEventListener('submit', async function(event){
          event.preventDefault();

          const contactsArr = [];
          const allContacts = document.querySelectorAll('.contacts__item');
          allContacts.forEach(($div) => {
            contactsArr.push({
              type: $div.querySelector('.contacts__select').value,
              value: $div.querySelector('.contacts__input').value
            })
          })

          if (contactsArr.length >= 10) {
            contactsBtn.setAttribute('disabled', 'disabled')
          }

          let clientsObj = {
            name: clientsInputName.value.trim(),
            surname: clientsInputSurname.value.trim(),
            lastName: clientsInputLastName.value.trim(),
            contacts: contactsArr
          }

          if (validation(this) && validationContacts(this)) {
            let serverDataObj = await serverAddClients(clientsObj);
          clientsList.push(serverDataObj)
      
          clientsInputName.value = '';
          clientsInputSurname.value = '';
          clientsInputLastName.value = '';
          
          console.log(clientsList);
          renderClientsTable(clientsList);
      
          modal.remove();
          }
        })

        clientsBtnCancel.addEventListener('click', function(){
          modal.remove();
        })

        clientsDivName.append(clientsInputName)
        clientsDivSurname.append(clientsInputSurname)
        contactsBlock.append(contactsBtn, contactsList)
        clientsForm.append(clientsDivName, clientsDivSurname, clientsInputLastName, contactsBlock, errorBlock, clientsBtnSave, clientsBtnCancel);
        content.append(clientsTitle, clientsForm);
  }
 );
})




//создание одного пользователя
function createClientTr(oneUser) {
  const $userTr = document.createElement('tr'),
        $userId = document.createElement('td'),
        $userFio = document.createElement('td'),
        $dataTimeCreated = document.createElement('td'),
        $dataCreated = document.createElement('div'),
        $timeCreated = document.createElement('div'),
        $dataTimeChange = document.createElement('td'),
        $dataChange = document.createElement('div'),
        $timeChange = document.createElement('div'),
        $contacts = document.createElement('td'),
        $contactsBlock = document.createElement('div'),
        $contactsList = document.createElement('ul'),
        $actions = document.createElement('td'),
        $changeBtn = document.createElement('button'),
        $deleteBtn = document.createElement('button');
        
        let liArr = []

        for (let contact of oneUser.contacts) {
          const $contactsItem = document.createElement('li');

          let type;
          switch (contact.type) {
            case 'Email':
              type = 'email';
              break;
            case 'Телефон':
              type = 'phone';
              break;
            case 'Facebook':
              type = 'fb';
              break;
            case 'Vk':
              type = 'vk';
              break; 
            case 'Другое':
              type = 'other';
              break;   
          }

          const $contactBtn = document.createElement('button');
          $contactBtn.classList.add('contact__btn')

          let strong = `${contact.type}: <b>${contact.value}</b>`

          tippy($contactBtn, {
            content: strong,
            allowHTML: true,
          })

          $contactBtn.innerHTML = svgs[type];

          $contactsItem.append($contactBtn)
          liArr.push($contactsItem)
          }

          $contactsList.append(...liArr)

          function checkContactsLength(liArr) {
            if (liArr.length > 4) {
              const hiddenContacts = liArr.slice(4)
              hiddenContacts.forEach(item=>item.classList.add('contact__visible'));

              const sumBtn = document.createElement('button');
              sumBtn.textContent = `+${hiddenContacts.length}`
              sumBtn.classList.add('contact__btn-sum')
              $contactsList.append(sumBtn)
              sumBtn.addEventListener('click', ()=>{
                hiddenContacts.forEach(item=>item.classList.remove('contact__visible'));
                sumBtn.remove()
              })
            }
          }
          checkContactsLength(liArr)

        const svgChange = 
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0 9.5002V12.0002H2.5L9.87333 4.62687L7.37333 2.12687L0 9.5002ZM11.8067 2.69354C12.0667 2.43354 12.0667 2.01354 11.8067 1.75354L10.2467 0.193535C9.98667 -0.0664648 9.56667 -0.0664648 9.30667 0.193535L8.08667 1.41354L10.5867 3.91354L11.8067 2.69354Z" fill="#9873FF"/>'+
        '</svg> Изменить';
        const svgDelete = 
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/>' +
        '</svg> Удалить';

        $userFio.textContent = oneUser.fio;
        $userId.textContent = oneUser.id;
        $dataCreated.textContent = oneUser.createdDate;
        $timeCreated.textContent = oneUser.createdTime
        $dataChange.textContent = oneUser.updatedData;
        $timeChange.textContent = oneUser.updatedTime;
        $changeBtn.innerHTML = svgChange;
        $deleteBtn.innerHTML = svgDelete;

        $userTr.classList.add('table__input');
        $userId.classList.add('input__field');
        $userFio.classList.add('input__field');
        $dataTimeCreated.classList.add('input__field');
        $dataCreated.classList.add('created__data');
        $timeCreated.classList.add('created__time');
        $dataChange.classList.add('created__data');
        $timeChange.classList.add('created__time');
        $dataTimeChange.classList.add('input__field');
        $changeBtn.classList.add('change__btn');
        $deleteBtn.classList.add('remove__btn');
        $contacts.classList.add('input__field');
        $actions.classList.add('input__field');
        $contactsList.classList.add('contacts__list')

        $dataTimeCreated.append($dataCreated, $timeCreated)
        $dataTimeChange.append($dataChange, $timeChange)
        $contactsBlock.append($contactsList)
        $contacts.append($contactsBlock);
        $actions.append($changeBtn);
        $actions.append($deleteBtn);
        $userTr.append($userId, $userFio, $dataTimeCreated, $dataTimeChange, $contacts, $actions);


        // при нажатии на кнопку Изменить открывается модальное окно для изменения данных
        $changeBtn.addEventListener('click', async function() {
          createModalForm(
            async function(modal, content, closeBtn){
              let changeTitle = document.createElement('h3'),
                  changeForm = document.createElement('form'),
                  changeLabelName = document.createElement('label'),
                  changeLabelSurname = document.createElement('label'),
                  changeLabeLastName = document.createElement('label'),
                  changeInputName = document.createElement('input'),
                  changeInputSurname = document.createElement('input'),
                  changeInputLastName = document.createElement('input'),
                  changeContactsBlock = document.createElement('div'),
                  changeContactsList = document.createElement('div'),
                  changeContactsBtn = document.createElement('button'),
                  changeBtnSave = document.createElement('button'),
                  changeBtnDelete = document.createElement('button');
          
                  changeTitle.textContent = 'Изменить данные'
                  changeLabelName.textContent = 'Имя*'
                  changeLabelSurname.textContent = 'Фамилия*'
                  changeLabeLastName.textContent = 'Отчество'
                  changeContactsBtn.textContent = 'Добавить контакт'
                  changeBtnSave.textContent = 'Сохранить'
                  changeBtnDelete.textContent = 'Удалить клиента'
          
                  changeTitle.classList.add('modal__title')
                  changeForm.classList.add('form')
                  changeInputName.classList.add('input')
                  changeInputSurname.classList.add('input')
                  changeInputLastName.classList.add('input')
                  changeContactsBlock.classList.add('contacts__block')
                  changeContactsBtn.classList.add('contacts__btn')
                  changeBtnSave.classList.add('btn__save')
                  changeBtnDelete.classList.add('btn__cancel')

                  await serverGetClient(oneUser.id)

                  window.location.hash = oneUser.id
            
                  changeInputName.value = oneUser.name
                  changeInputSurname.value = oneUser.surname
                  changeInputLastName.value = oneUser.lastName

                  for (let contact of oneUser.contacts) {

                    const contactItem = document.createElement('div'),
                          contactSelect = document.createElement('select'),
                          optionPhone = document.createElement('option'),
                          optionEmail = document.createElement('option'),
                          optionFacebook = document.createElement('option'),
                          optionVk = document.createElement('option'),
                          optionOther = document.createElement('option'),
                          contactsInput = document.createElement('input'),
                          contactItemDelete = document.createElement('button');

                          optionPhone.textContent = 'Телефон'
                          optionEmail.textContent = 'Email'
                          optionFacebook.textContent = 'Facebook'
                          optionVk.textContent = 'Vk'
                          optionOther.textContent = 'Другое'

                          contactItem.classList.add('contacts__item')
                          contactSelect.classList.add('contacts__select')
                          contactsInput.classList.add('contacts__input')
                          contactItemDelete.classList.add('contacts__cancel')
                          changeContactsBtn.classList.add('contacts__btn-add')

                          contactSelect.append(optionPhone, optionEmail, optionFacebook, optionVk, optionOther)
                          contactItem.append(contactSelect, contactsInput, contactItemDelete)
                          changeContactsList.append(contactItem)

                          contactsInput.value = contact.value
                          contactSelect.value = contact.type

                          const choicess = new Choices(contactSelect, {
                            searchEnabled: false,
                            shouldSort: false,
                            itemSelectText: '',
                            placeholder: true
                          })

                          contactItemDelete.addEventListener('click', function(el) {
                            el.preventDefault()
                            contactItem.remove()
                          })
                  }

                  //при нажатии "Добавить контакт" появляется поле для заполнения
                  changeContactsBtn.addEventListener('click', function(e) {
                    e.preventDefault()
          
                    const contactItem = document.createElement('div'),
                          contactSelect = document.createElement('select'),
                          optionPhone = document.createElement('option'),
                          optionEmail = document.createElement('option'),
                          optionFacebook = document.createElement('option'),
                          optionVk = document.createElement('option'),
                          optionOther = document.createElement('option'),
                          contactsInput = document.createElement('input'),
                          contactItemDelete = document.createElement('button');
          
                          optionPhone.textContent = 'Телефон'
                          optionEmail.textContent = 'Email'
                          optionFacebook.textContent = 'Facebook'
                          optionVk.textContent = 'Vk'
                          optionOther.textContent = 'Другое'
                          contactsInput.placeholder = 'Введите данные контакта'
          
                          contactItem.classList.add('contacts__item')
                          contactSelect.classList.add('contacts__select')
                          contactsInput.classList.add('contacts__input')
                          contactItemDelete.classList.add('contacts__cancel')
                          changeContactsBtn.classList.add('contacts__btn-add')
          
                          contactSelect.append(optionPhone, optionEmail, optionFacebook, optionVk, optionOther)
                          contactItem.append(contactSelect, contactsInput, contactItemDelete)
                          changeContactsList.append(contactItem)
          
                          const choices = new Choices(contactSelect, {
                            searchEnabled: false,
                            shouldSort: false,
                            itemSelectText: '',
                            placeholder: true
                          })
          
                          contactItemDelete.addEventListener('click', function(el) {
                            el.preventDefault()
                            contactItem.remove()
                          })

                          if (document.querySelectorAll('.contacts__item').length >= 10) {
                            changeContactsBtn.setAttribute('disabled', 'disabled')
                          }
                  })


                  //по нажатию на кнопку данные из формы о клиенте обновляются
                  changeForm.addEventListener('submit', async function(e){
                    e.preventDefault();

                    const contactsArr = [];
                    const allContacts = document.querySelectorAll('.contacts__item');
                    allContacts.forEach(($div) => {
                      contactsArr.push({
                        type: $div.querySelector('.contacts__select').value,
                        value: $div.querySelector('.contacts__input').value
                      })
                    })
          
                    const clientUser = {
                      name: changeInputName.value.trim(),
                      surname: changeInputSurname.value.trim(),
                      lastName: changeInputLastName.value.trim(),
                      contacts: contactsArr
                    }
                    
                    await serverChangeClient(oneUser.id, clientUser)

                    console.log(serverGetClients().then(el => console.log(el)));
        
                    modal.remove();

                    console.log(contactsArr)
                  })
          
                  changeBtnDelete.addEventListener('click', function(){
                    modal.remove();
                  })
          
                  changeLabelName.append(changeInputName)
                  changeLabelSurname.append(changeInputSurname)
                  changeLabeLastName.append(changeInputLastName)
                  changeContactsBlock.append(changeContactsBtn, changeContactsList )
                  changeForm.append(changeInputName, changeInputSurname, changeInputLastName, changeContactsBlock, changeBtnSave, changeBtnDelete);
                  content.append(changeTitle, changeForm);
              }
            );
          });


          //модальное окно для подтверждения УДАЛЕНИЯ клиента
          $deleteBtn.addEventListener('click', function() {
            createModalForm(
              function(modal, content, closeBtn) {
                const deleteTitle = document.createElement('h3'),
                      deleteDescr = document.createElement('p'),
                      btnsBlock = document.createElement('div'),
                      deleteBtn = document.createElement('button'),
                      cancelBtn = document.createElement('button');

                      deleteTitle.textContent = 'Удалить клиента'
                      deleteDescr.textContent = 'Вы действительно хотите удалить данного клиента?'
                      deleteBtn.textContent = 'Удалить'
                      cancelBtn.textContent = 'Отмена'

                      deleteTitle.classList.add('delete__title')
                      deleteDescr.classList.add('delete__descr')
                      btnsBlock.classList.add('btns__block')
                      deleteBtn.classList.add('btn__save')
                      cancelBtn.classList.add('btn__cancel')
                      content.classList.add('delete__modal')

                      deleteBtn.addEventListener('click', async function() {
                        await serverDeletetClient(oneUser.id);
                        $userTr.remove()
                        modal.remove();
                      })

                      cancelBtn.addEventListener('click', function(){
                        modal.remove();
                      })

                      btnsBlock.append(deleteBtn, cancelBtn)
                      content.append(deleteTitle, deleteDescr, btnsBlock)
              }
            )  
          });

        return $userTr     
}




// отрисовка клиента в таблице
function renderClientsTable(clientsArr) {
  $tableBody.innerHTML = '';
  let copyClientsList = [...clientsArr];

  for (const oneUser of copyClientsList) {
    // Вывод ФИО
    oneUser.fio = oneUser.name + ' ' + oneUser.surname + ' ' + oneUser.lastName;
    
    //Вывод даты создания
    let year = Number(oneUser.createdAt.substr(0, 4));
    let month = Number(oneUser.createdAt.substr(5, 2));
    let day = oneUser.createdAt.substr(8, 2);
    let hour = oneUser.createdAt.substr(11, 2);
    let minutes = oneUser.createdAt.substr(14, 2);
    oneUser.createdDate = day + '.' + month + '.' + year + ' ';
    oneUser.createdTime = hour + '.' + minutes;

    //Вывод даты изменения
    let yearChange = Number(oneUser.updatedAt.substr(0, 4));
    let monthChange = Number(oneUser.updatedAt.substr(5, 2));
    let dayChange = oneUser.updatedAt.substr(8, 2);
    let hourChange = oneUser.updatedAt.substr(11, 2);
    let minutesChange = oneUser.updatedAt.substr(14, 2);
    oneUser.updatedData = dayChange + '.' + monthChange + '.' + yearChange + ' ';
    oneUser.updatedTime = hourChange + '.' + minutesChange;
  }

  // Сотрировка
  copyClientsList = copyClientsList.sort(function(a, b) {
    let sort = a[sortColumnFlag] < b[sortColumnFlag]
    if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag]
    if (sort) return -1
  })

  // Фильтрация
  if ($searchInput.value.trim() !== "") {
    copyClientsList = filter(copyClientsList, 'fio', $searchInput.value)
  }

  // Отрисовка
  for (const oneUser of copyClientsList) {
    const $newTr = createClientTr(oneUser)
    $tableBody.append($newTr);
  }

}

//Сортировка
const $sortIdInp = document.getElementById('sort__id'),
      $sortFioInp = document.getElementById('sort__fio'),
      $sortDateInp = document.getElementById('sort__date'),
      $sortChangeInp = document.getElementById('sort__change'),
      $svgId = document.getElementById('svg__id'),
      $svgDate = document.getElementById('svg__date'),
      $svgChange = document.getElementById('svg__change');

function sortClientsTable() {
 
  $sortIdInp.addEventListener('click', function() {
    sortColumnFlag = 'id';

    if (sortDirFlag == true) {
     $svgId.classList.add('svg-rotation') 
    } else if (sortDirFlag == false) {
      $svgId.classList.remove('svg-rotation')
    }
    sortDirFlag = !sortDirFlag
    renderClientsTable(clientsList);
  });

  $sortFioInp.addEventListener('click', function() {
    sortColumnFlag = 'fio';
    sortDirFlag = !sortDirFlag 
    renderClientsTable(clientsList) 
  });

  $sortDateInp.addEventListener('click', function() {
    sortColumnFlag = 'createdTime';
    if (sortDirFlag == false) {
      $svgDate.classList.add('svg-rotation') 
     } else if (sortDirFlag == true) {
       $svgDate.classList.remove('svg-rotation')
     }
    sortDirFlag = !sortDirFlag
    renderClientsTable(clientsList);
  });

  $sortChangeInp.addEventListener('click', function() {
    sortColumnFlag = 'updatedTime';
    if (sortDirFlag == false) {
      $svgChange.classList.add('svg-rotation') 
     } else if (sortDirFlag == true) {
       $svgChange.classList.remove('svg-rotation')
     }
    sortDirFlag = !sortDirFlag
    renderClientsTable(clientsList);
  });

}

//Фильтрация
const $searchForm = document.getElementById('search__form'),
      $searchInput = document.getElementById('search__input');

$searchForm.addEventListener('submit', function(e) {
  e.preventDefault();
});

$searchInput.addEventListener('input', function() {
  renderClientsTable(clientsList)
});

function filter(arr, prop, value) {
  return arr.filter(function(oneUser) {
    if (String(oneUser[prop]).toLowerCase().includes(value.trim().toLowerCase())) return true
  })
}

const spinnerRotate = document.getElementById('spinner')

function spinnerVisible() {
  spinnerRotate.style.display = 'block'
}

function spinnerNotVisible() {
  spinnerRotate.style.display = 'none'
}


//API

let SERVER_URL = 'http://localhost:3000';

async function serverAddClients(obj) {
  let response = await fetch(SERVER_URL + '/api/clients', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json', }
      });
      let data = await response.json();
      return data
}

async function serverGetClients() {
  spinnerVisible()

  let response = await fetch(SERVER_URL + '/api/clients', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', }
      });
      let data = await response.json();

      spinnerNotVisible()

      return data
}

let serverData = await serverGetClients();

if (serverData) {
  clientsList = serverData;
}

async function serverGetClient(id) {
  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
        method: 'GET',
      })
      let data = await response.json();
      return data
}

async function serverChangeClient(id, object) {
  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
        method: 'PATCH',
        body: JSON.stringify(object),
        headers: { 'Content-Type': 'application/json', }
      })
      let data = await response.json();
      return data
}

async function serverDeletetClient(id) {
  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
        method: 'DELETE',
      })
      let data = await response.json();
      return data
}


renderClientsTable(clientsList)

sortClientsTable();




