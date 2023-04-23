// // 주소에 쿼리스트링 받아오기
// const queryString = new URLSearchParams(window.location.search);
// const nameText = queryString.get('item-name');

// // html name에 접근
// const inputTextObjects = document.getElementsByName('item-name');
// inputTextObject = inputTextObjects[0];

// // input value 값 넣기
// inputTextObject.value = nameText;

// // 주소에 쿼리스트링 배열로 받기
// const inputHiddenList = queryString.getAll('input-hidden');
// const inputHidden = inputHiddenList[0];

// const todoList = 1;

// inputTextObject.focus();
// inputTextObject.blur();

let items;

const ajax = function(method, url, data, callback) {
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function() {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      callback(xhrObject);
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      }
      console.error(error);
    }
  };
  xhrObject.open(method, url);
  xhrObject.setRequestHeader('Content-Type', 'application/json');
  xhrObject.send(JSON.stringify(data)); // send()로 보낼때 item의 object는 string 타입을 보냄

};

const itemsCreate = function(form) {
  console.log(firebaseUser);

  const itemNameObject = form['item-name'];
  const item = {
    name: itemNameObject.value,
    enter: moment().format("YYYY-MM-DD"),
    expire: moment().add(7, 'days').format("YYYY-MM-DD")
  };
  axios.post('https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/items.json', item).then(function() {
    itemNameObject.value = '';
    itemsRead();
  });
};

const itemsRead = function() {
  axios.get('https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/items.json').then(function(response) {
    items = response.data;
    const tagDivParent = document.getElementById('tag-tbody-parent');
    tagDivParent.innerHTML = '';
    const tagDivChild = document.getElementById('tag-tr-child');
    let index = 0;
    
    for (let uid in items) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const item = items[uid];
      const itemsGroceryObject = document.getElementsByName('items-grocery')[index];
      const itemsNameObject = document.getElementsByName('items-name')[index];
      const itemsEnterObject = document.getElementsByName('items-enter')[index];
      const itemsExpireObject = document.getElementsByName('items-expire')[index];
      const itemsDeleteObject = document.getElementsByName('items-delete')[index];
      itemsNameObject.innerHTML =  item.name;
      itemsEnterObject.innerHTML = item.enter;
      itemsExpireObject.value = item.expire;
      itemsExpireObject.index = index;
      itemsExpireObject.uid = uid;
      itemsDeleteObject.uid = uid;
      itemsGroceryObject.index = index;
      itemsGroceryObject.uid = uid;
      index++;
    }
    console.log('Read', items);
  });
};

//itemsRead();

const itemsDelete = function(uid) {
  const url = 'https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/items/'+ uid + '.json';
   axios.delete(url).then(itemsRead);
};

const itemsUpdate = function(index, uid) {
  const url = 'https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/items/'+ uid + '.json';
  const name = document.getElementsByName('items-name')[index].innerText;
  const enter = document.getElementsByName('items-enter')[index].innerText;
  const expire = document.getElementsByName('items-expire')[index].value;
  const item = {
    name: name,
    enter: enter,
    expire: expire
  };
  axios.patch(url, item).then(function(){
    itemsRead();
  });
};