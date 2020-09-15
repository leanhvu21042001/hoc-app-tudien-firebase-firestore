/**
 * Author: Lê Anh Vũ
 * firebase-app, firebase-store
 * 15/09/2020
 */
const listGroup = document.querySelector('.word-list');
const formAddNewWord = document.querySelector('#addNewWord');
let newWord = '';
let newMean = '';
let flag = false;
// create element, change contents, delete element
function renderListWords(doc) {
  let li = document.createElement('li');
  let word = document.createElement('span');
  let mean = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  li.setAttribute('class', 'word-mean');
  word.textContent = doc.data().word;
  word.setAttribute('class', 'word');
  mean.textContent = doc.data().mean;
  mean.setAttribute('class', 'mean');
  cross.textContent = 'x';

  li.appendChild(word);
  li.appendChild(mean);
  li.appendChild(cross);

  listGroup.appendChild(li);

  //deleting data
  cross.addEventListener('click', function (e) {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('EnglishWords').doc(id).delete();
  });
  li.addEventListener('click', function (e) {
    e.preventDefault();
    // khai báo biến
    flag = confirm('Bạn mốn thay đổi không ?');
    let id = e.target.parentElement.getAttribute('data-id');
    console.log(id);
    console.log(flag);
    // nhap newword va newmean
    if (flag) {
      do {
        newWord = prompt('Nhập từ mới: ');
      } while (newWord.length <= 0);
      do {
        newMean = prompt('Nhập nghĩa từ mới: ');
      } while (newMean.length <= 0);
      
      db.collection('EnglishWords').doc(id).update({
        word: newWord,
        mean: newMean
      });
    }
  });
}

// saving data (saving new word)
formAddNewWord.addEventListener('submit', function (event) {
  event.preventDefault();
  db.collection('EnglishWords').add({
    word: formAddNewWord.word.value,
    mean: formAddNewWord.mean.value
  });
  // console.log(formAddNewWord.word.value);
  // console.log(formAddNewWord.mean.value);
  formAddNewWord.word.value = '';
  formAddNewWord.mean.value = '';
});

// real-time listener
db.collection('EnglishWords').orderBy('word').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  // xóa sẽ xóa cái hiện tại nếu không sẽ tải lại danh sách
  changes.forEach(change => {
    if (change.type === 'added') {
      renderListWords(change.doc);
    } else if (change.type === 'removed') {
      let li = listGroup.querySelector("[data-id=" + change.doc.id + "]");
      listGroup.removeChild(li);
    }
  });
  const wordList = document.querySelectorAll('.word-list li');
  wordList.forEach(ele => {
    ele.addEventListener('click', function (e) {
      // console.log(this.children[0].textContent)
      // console.log(this.children[1].textContent)
      // console.log(flag);
      // console.log(newWord);
      // console.log(newMean);
      if (flag) {
        this.children[0].textContent = newWord;
        this.children[1].textContent = newMean;
      }
    })
  })
});