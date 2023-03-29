// // 주소에 쿼리스트링 받아오기
// const queryString = new URLSearchParams(window.location.search);
// const nameText = queryString.get('grocery-name');

// // html name에 접근
// const inputTextObjects = document.getElementsByName('grocery-name');
// inputTextObject = inputTextObjects[0];

// // input value 값 넣기
// inputTextObject.value = nameText;

// // 주소에 쿼리스트링 배열로 받기
// const inputHiddenList = queryString.getAll('input-hidden');
// const inputHidden = inputHiddenList[0];

// const todoList = 1;

// inputTextObject.focus();
// inputTextObject.blur();

let groceries;

// const ajax = function(method, url, data, callback) {
//   const xhrObject = new XMLHttpRequest();
//   xhrObject.onreadystatechange = function() {
//     if (xhrObject.readyState !== 4) return;
//     if (xhrObject.status === 200) {
//       callback(xhrObject);
//     } else {
//       const error = {
//         status: xhrObject.status,
//         statusText: xhrObject.statusText,
//         responseText: xhrObject.responseText
//       }
//       console.error(error);
//     }
//   };
//   xhrObject.open(method, url);
//   xhrObject.setRequestHeader('Content-Type', 'application/json');
//   xhrObject.send(JSON.stringify(data)); // send()로 보낼때 grocery의 object는 string 타입을 보냄

// };

const groceriesCreate = function(input) {
  console.log(input);
  
  const index = input.index;
  const uid = input.uid;
  const checked = input.checked;
  
  if(checked){
    const url = 'https://javascript-red-default-rtdb.firebaseio.com/groceries/'+ uid + '.json';
    const grocery = {
      name: document.getElementsByName('items-name')[index].innerText,
      enter: document.getElementsByName('items-enter')[index].innerText,
      expire: document.getElementsByName('items-expire')[index].value
    };

    // post는 무조건 uid까지 생성함
    // patch 는 uid는 생성안해줌
    // put은 가지고 있는 걸 미는 개념
    // patch보단 put을 더 많이 사용
    axios.put(url, grocery).then();
  }else {
    groceriesDelete(uid, 'items'); 
    //axios.delete(url).then(); //axios를 사용할 땐 url 변수를 if문 위에 사용해서 적용 할 수 있도록 수정함
  }

};
const groceriesRead = function() {
  axios.get('https://javascript-red-default-rtdb.firebaseio.com/groceries.json').then(function(response) {
    groceries = response.data;
    const tagDivParent = document.getElementById('tag-tbody-parent');
    tagDivParent.innerHTML = '';
    const tagDivChild = document.getElementById('tag-tr-child');
    let index = 0;


    for (let uid in groceries) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const grocery = groceries[uid];
      const groceriesNameObject = document.getElementsByName('groceries-name')[index];
      const groceriesEnterObject = document.getElementsByName('groceries-enter')[index];
      const groceriesExpireObject = document.getElementsByName('groceries-expire')[index];
      const groceriesUpdateObject = document.getElementsByName('groceries-update')[index];
      const groceriesDeleteObject = document.getElementsByName('groceries-delete')[index];
      const groceriesSequenceObject = document.getElementsByName('groceries-sequence')[index];
      groceriesSequenceObject.innerHTML = index+1;
      groceriesNameObject.innerHTML =  grocery.name;
      groceriesEnterObject.innerHTML = grocery.enter;
      groceriesExpireObject.innerHTML = grocery.expire;
      groceriesUpdateObject.index = index;
      groceriesUpdateObject.uid = uid;
      groceriesDeleteObject.uid = uid;
      index++;
    }
    console.log('Read', groceries);
  });
};

//groceriesRead();

const groceriesDelete = function(uid, callback) {
  const url = 'https://javascript-red-default-rtdb.firebaseio.com/groceries/'+ uid + '.json';
   axios.delete(url).then(
    function(){
      //from === 'groceries' && groceriesRead();
      callback && callback();
    }
  );
};

const groceriesUpdate = function(index, uid) {
  const url = 'https://javascript-red-default-rtdb.firebaseio.com/groceries/'+ uid + '.json';
  const name = document.getElementsByName('groceries-name')[index].innerText;
  const enter = document.getElementsByName('groceries-enter')[index].innerText;
  const expire = document.getElementsByName('groceries-expire')[index].innerText;
  const grocery = {
    name: name,
    enter: enter,
    expire: expire
  };
  axios.patch(url, grocery).then(function(){
    groceriesRead();
  });
};