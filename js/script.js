let money = document.getElementById("money");  // получение элемента по идентификатору ID (забираем элементы из дерева выше. присваиваем в переменные см. ниже)
let display = document.getElementById("display");
let bill_acc = document.getElementById("bill_acc");
let displayInfo = document.getElementById("displayInfo");
let displayBalance = document.getElementById("displayBalance");
let progressBar = document.getElementsByClassName("progress-bar")[0];
let change_box = document.getElementById("change_box");
let lock = document.getElementById("lock");
let progress = 0;

function getCoffee(coffeName,price){ // функция расчета (имя, цена по прайсу)
  if(+money.value>=price){
    money.value = +money.value-price;
    displayBalance.innerText = money.value;
    let timerId = setInterval(()=>{
      lock.hidden = false;
      if(progress>115){
        clearInterval(timerId);
        progressBar.hidden = true;
        progressBar.style.width = 0+'%';
        displayInfo.innerHTML = `<i class="fas fa-mug-hot"></i> Кофе ${coffeName} готов`; // иконка 
        coffeecup.style.opacity = 1;
        progress = 0;
        lock.hidden = true;
        return;
      }
      else if(progress<45) displayInfo.innerHTML = `<i class="fas fa-hourglass-start"></i> Приготовление...`; // иконка 
      else if(progress<85) displayInfo.innerHTML = `<i class="fas fa-hourglass-half"></i> Приготовление...`; // иконка 
      else displayInfo.innerHTML = `<i class="fas fa-hourglass-end"></i> Приготовление...`; // иконка 
      progressBar.hidden = false;
      progressBar.style.width = ++progress+'%';
    },75);
      let audio = new Audio("audio/readycoffee.mp3"); // приклеиваем аудио 
      audio.play();
  }else{
    displayInfo.innerHTML = `<i class="fas fa-piggy-bank"></i> Недостаточно средств`; // иконка 
  }
}


let banknotes = document.querySelectorAll("[src$='rub.jpg']"); // Селектор собирает массив картинок
let zIndex = 1;
for(let i=0; i<banknotes.length; i++){ // Итерируем картинки 0, 1, 2 (3 банкноты)
  let banknote = banknotes[i]; // Переменная банкнота присваивает элемент массива 'банкноты'
  banknote.onmousedown = function(e){ // функция при нажатии на банкноту (меняем стили, отключаем драг дроп браузера)
    this.ondragstart = function(){return false;} // отключаем браузерную функцию драг дроп чтобы не мешала на этой функции
    this.style.position = 'absolute'; // включаем на банкноте, которую перетаскиваем, позиционир. абсолютное 
    this.style.zIndex = ++zIndex; // активная купюра всегда сверху (индекс постоянно возрастает - надо по другому написать)
    this.style.transform = 'rotate(90deg)'; // влючаем поворот активной банкноты
    moveAt(e);
    function moveAt(event){
      banknote.style.top = (event.clientY-banknote.offsetHeight/2)+'px'; // меняем стили чтобы хватать банкноту в середине
      banknote.style.left = (event.clientX-banknote.offsetWidth/2)+'px';  // *
    }
    document.addEventListener('mousemove',moveAt); // включаем слежение за событием - перемещение банкноты
    this.onmouseup = function(){  // функция при отпускании банкноты
      document.removeEventListener('mousemove',moveAt); // отменяем слежение за событием
      let bill_acc_top = bill_acc.getBoundingClientRect().top; // Верх купюроприёмника (задаем границы см. ниже)
      let bill_acc_bottom = bill_acc.getBoundingClientRect().bottom - (bill_acc.getBoundingClientRect().height*2/3);
      let bill_acc_left = bill_acc.getBoundingClientRect().left;
      let bill_acc_right = bill_acc.getBoundingClientRect().right;
      let banknote_top = this.getBoundingClientRect().top; // Верх купюры (задаем границы)
      let banknote_left = this.getBoundingClientRect().left;
      let banknote_right = this.getBoundingClientRect().right;
      if(bill_acc_top<banknote_top && bill_acc_bottom>banknote_top && bill_acc_left<banknote_left && bill_acc_right>banknote_right){
        money.value = (+money.value)+(+this.dataset.value);
        displayBalance.innerText = money.value;
        this.hidden = true;
      let audio = new Audio("audio/bill.mp3"); // приклеиваем аудио 
      audio.play();
      }
    }
  }
}

function getChange(num){  // сдача оставил рекурсию (вариант с циклами закоментен ниже)
  let change_box_h = change_box.getBoundingClientRect().height-60;
  let change_box_w = change_box.getBoundingClientRect().width-60;
  let change = 0;
  let top = Math.random()*change_box_h;
  let left = Math.random()*change_box_w;
  if(num>=10) change = 10;
  else if(num>=5) change = 5;
  else if(num>=2) change = 2;
  else if(num>=1) change = 1;
  else{
    let audio = new Audio("audio/getChange.mp3"); // приклеиваем аудио высыпания монеток
    audio.play();
  }
  
  if(change>0){
    let img = document.createElement('img');
    img.src = `img/${change}rub.png`;
    img.style.top = top +'px';
    img.style.left= left +'px';
    img.onclick = function(){this.hidden=true;}
    change_box.append(img);
    displayBalance.innerText = money.value = 0;
    getChange(num-change);
  }
}