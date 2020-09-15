const listGroup = document.querySelector('.word-list');
const formAddNewWord = document.querySelector('#addNewWord');
function renderListWords(doc) {
  let li = document.createElement('li');
  let word = document.createElement('span');
  let mean = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  li.setAttribute('class','word');
  word.textContent = doc.data().word;
  mean.textContent = doc.data().mean;
  cross.textContent = 'x';

  li.appendChild(word);
  li.appendChild(mean);
  li.appendChild(cross);

  listGroup.appendChild(li);

  //deleting data
  cross.addEventListener('click', function (e) {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    console.log(id);
    db.collection('EnglishWords').doc(id).delete();
  });
  word.addEventListener('click', function (e) {
    e.preventDefault();
    let id = e.target.parentElement.getAttribute('data-id');
    const flag = confirm('Bạn mốn thay đổi không ?');
    if (flag) {
      const newWord = '';
      const newMean = '';
      newWord = prompt('Nhập từ mới: ');
      newMean = prompt('Nhập nghĩa từ mới: ');
      console.log(newWord);
      console.log(newMean);

      db.collection('EnglishWords').doc(id).update({
        word: newWord,
        mean: newMean
      });
      location.reload();
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
  console.log(formAddNewWord.word.value);
  console.log(formAddNewWord.mean.value);
  formAddNewWord.word.value = '';
  formAddNewWord.mean.value = '';
});
// real-time listener
db.collection('EnglishWords').orderBy('word').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  let arr = new Array(changes);
  console.log(changes)
  changes.forEach(change => {
    if (change.type === 'added') {
      renderListWords(change.doc);
    } else if (change.type === 'removed') {
      let li = listGroup.querySelector("[data-id=" + change.doc.id + "]");
      listGroup.removeChild(li);
    }
  });
});
