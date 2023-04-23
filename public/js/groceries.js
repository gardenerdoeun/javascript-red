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
    const url = 'https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/groceries/'+ uid + '.json';
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
const groceriesRead = function(q, orderColumn, orderDirection) {
  axios.get('https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/groceries.json').then(function(response) {
    // groceries = response.data;

    let groceries = [];
    //TODO : q 값에 검색된 데이터 추출
    for(let uid in response.data){
      const grocery = response.data[uid];
      grocery.uid = uid;
      // TODO : 검색 조건
      // 1) q 가 없으면 모두 담기
      // 2) name 안의 문자가 q를 포함 한다면  
      if(grocery.name.indexOf(q) >= 0){
        groceries.push(grocery);
      }
    }

    //items와 비교해서 checkbox 체크하기
    if(document.location.pathname === '/items.html'){
      console.log('아이템 있음', items, groceries);
      let i=0;
      console.log(i);
      for(let itemUid in items){
        //        console.log(itemUid);
        for(let j in groceries){
          const grocery = groceries[j];
          //          console.log(grocery.uid);
          if(itemUid === grocery.uid){
            console.log("둘 값이 같음");
            document.getElementsByName('items-grocery')[i].checked = true;
          }
        }
        i++;
        console.log('last', i);
      }

    }

    //성능 확인
    console.time('start'); // 성능 속도 측정 시작할 때 사용
    //카운트
    let count = 0;
    for (let index in groceries) {
      const grocery = groceries[index];
      // 만료일이 D-7일 이전이면 count++
      if((moment().diff(moment(grocery.expire), 'days') -1) >= -7){
        count++;
      }
    }
    
    //카운트 넣기
    document.getElementById('menu-groceries-counter').innerHTML = count;
    console.timeEnd('start');// 성능 속도 측정 끝낼때 사용 (속도가 500ms 이상일 때는 성능에 문제가 있는거임 )
    if(document.getElementsByName('groceries-sequence').length == 0) return;


    groceries = _.orderBy(groceries, orderColumn, orderDirection);

    //화면 그리기
    const tagDivParent = document.getElementById('tag-tbody-parent');
    tagDivParent.innerHTML = '';
    const tagDivChild = document.getElementById('tag-tr-child');
    for (let index in groceries) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const grocery = groceries[index];
      const uid = groceries[index].uid;
      const groceriesNameObject = document.getElementsByName('groceries-name')[index];
      const groceriesEnterObject = document.getElementsByName('groceries-enter')[index];
      const groceriesExpireObject = document.getElementsByName('groceries-expire')[index];
      const groceriesUpdateObject = document.getElementsByName('groceries-update')[index];
      const groceriesDeleteObject = document.getElementsByName('groceries-delete')[index];
      const groceriesSequenceObject = document.getElementsByName('groceries-sequence')[index];
      groceriesSequenceObject.innerHTML = Number(index)+1;
      groceriesNameObject.innerHTML =  grocery.name;
      groceriesEnterObject.innerHTML = grocery.enter;
      groceriesExpireObject.innerHTML = grocery.expire;
      groceriesUpdateObject.index = index;
      groceriesUpdateObject.uid = uid;
      groceriesDeleteObject.uid = uid;
    }

  });
};

//groceriesRead();

const groceriesDelete = function(uid, callback) {
  const url = 'https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/groceries/'+ uid + '.json';
   axios.delete(url).then(
    function(){
      //from === 'groceries' && groceriesRead();
      callback && callback();
    }
  );
};

const groceriesUpdate = function(uid) {
  const url = 'https://javascript-red-default-rtdb.firebaseio.com/'+firebaseUser.uid +'/groceries/'+ uid + '.json';
  const name = document.getElementsByName('grocery-name')[0].value;
  const enter = document.getElementsByName('grocery-enter')[0].value;
  const expire = document.getElementsByName('grocery-expire')[0].value;
  const grocery = {
    name: name,
    enter: enter,
    expire: expire
  };
  axios.patch(url, grocery).then(function(){
    firebaseAfterLogin();
    modalToggle();
  });
};