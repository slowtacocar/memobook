import './index.scss'

import 'firebase/auth'
import 'firebase/firestore'
import * as firebaseui from 'firebaseui'
import $ from 'jquery'
import config from './config'
import firebase from 'firebase/app'

firebase.initializeApp(config)
const ui = new firebaseui.auth.AuthUI(firebase.auth())
const db = firebase.firestore()
let docRef
let notesRef
let unsubscribe
let tags

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    $('#firebaseui').hide()
    docRef = db.collection('user').doc(user.uid)
    notesRef = docRef.collection('notes')

    const query = notesRef.where('tags', 'array-contains', 'All notes')
    unsubscribe = query.onSnapshot((snapshot) => {
      $('#notes').html('')
      snapshot.forEach((doc) => {
        $('#notes').append(`
          <div class="card">
            <div class="card-body note-body">
              ${doc.data().html}
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary" id="openNote${doc.id}">Open Note</button>
            </div>
          </div>
        `)
        $(`#openNote${doc.id}`).click(doc, (event) => {
          const data = event.data.data()
          $('.note').removeClass('hidden')
          $('.note-text').html(data.html)
          const tagsArray = data.tags
          tagsArray.splice(tagsArray.indexOf('All notes'), 1)
          $('.tags-text').val(tagsArray.join())
          $('.note').data('id', event.data.id)
        })
      })
    })

    notesRef.onSnapshot((snapshot) => {
      const activeTags = $('.tags > .tag.active').map((i, e) => $(e).html()).get()
      $('.tags').html('')
      tags = []
      snapshot.forEach((doc) => {
        doc.data().tags.forEach((tag, i, tagData) => {
          if (!tags.includes(tag)) {
            tags.push(tag)
            const active = activeTags.includes(tag) ? ' active' : ''
            $('.tags').append(`<a class="nav-link tag${active}" id="tag-${tags.indexOf(tag)}" href="#">${tag}</a>`)
            $(`#tag-${tags.indexOf(tag)}`).click((event) => {
              if ($(event.target).html() === 'All notes') {
                $('.tag').removeClass('active')
              } else {
                $(`#tag-${tags.indexOf('All notes')}`).removeClass('active')
              }
              $(event.target).toggleClass('active')
              const active = $('.tags > .tag.active').map((i, e) => $(e).html()).get()
              if (active.length <= 0) {
                $(`#tag-${tags.indexOf('All notes')}`).addClass('active')
              }
              const query = notesRef.where('tags', 'array-contains-any', $('.tags > .tag.active').map((i, e) => $(e).html()).get())
              if (unsubscribe) {
                unsubscribe()
              }
              unsubscribe = query.onSnapshot((snapshot) => {
                $('#notes').html('')
                snapshot.forEach((doc) => {
                  $('#notes').append(`
                    <div class="card">
                      <div class="card-body note-body">
                        ${doc.data().html}
                      </div>
                      <div class="card-footer">
                        <button type="button" class="btn btn-primary" id="openNote${doc.id}">Open Note</button>
                      </div>
                    </div>
                  `)
                  $(`#openNote${doc.id}`).click(doc, (event) => {
                    const data = event.data.data()
                    $('.note').removeClass('hidden')
                    $('.note-text').html(data.html)
                    const tagsArray = data.tags
                    tagsArray.splice(tagsArray.indexOf('All notes'), 1)
                    $('.tags-text').val(tagsArray.join())
                    $('.note').data('id', event.data.id)
                  })
                })
              })
            })
          }
          if (i === tagData.length - 1) {
            const active = $('.tags > .tag.active').map((i, e) => $(e).html()).get()
            if (active.length <= 0) {
              $(`#tag-${tags.indexOf('All notes')}`).addClass('active')
              $(`#tag-${tags.indexOf('All notes')}`).click()
            }
          }
        })
      })
    })
  } else {
    $('#firebaseui').show()
    ui.start('#firebaseui', {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => false
      }
    })
  }
})

$('#newNote').click(() => {
  $('.note').removeClass('hidden')
  $('.note-text').html('')
  $('.tags-text').val('')
  notesRef.add({
    html: '',
    tags: ['All notes']
  }).then((doc) => {
    $('.note').data('id', doc.id)
  })
})

$('#closeNote').click(() => {
  $('.note').addClass('hidden')
})

$('#saveNote').click(() => {
  const tagsArray = $('.tags-text').val() === '' ? [] : $('.tags-text').val().split(',')
  tagsArray.push('All notes')
  notesRef.doc($('.note').data('id')).update({
    html: $('.note-text').html(),
    tags: tagsArray.map((str) => str.trim())
  })
})

$('#deleteNote').click(() => {
  notesRef.doc($('.note').data('id')).delete().then(() => {
    $('.note').addClass('hidden')
  })
})

$(() => {
  $('body').removeClass('preload').attr('hidden', false)
})
