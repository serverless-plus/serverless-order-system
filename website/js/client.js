const { apiUrl } = window.env;

function getDishList() {
  fetch(apiUrl + 'get_shop_info')
    .then((res) => res.json())
    .then((list) => {
      const dishes = list.data;
      const shopDishs = {};
      const shopListEle = document.querySelector('#shop');
      shopListEle.innerHTML = '';
      dishes.forEach((item) => {
        if (!shopDishs[item.shop_name]) {
          shopDishs[item.shop_name] = [];
        }
        shopDishs[item.shop_name].push(item);
      });
      Object.entries(shopDishs).map(([key, menus]) => {
        const shop = document.createElement('div');
        const menuList = menus.map((item) => {
          return `
                <div>
                  <label>
                    <input type="checkbox" data-shop="${key}" data-dish="${item.dish}" data-price="${item.price}"> 
                    ${item.dish} ${item.price}元
                  </label>
                </div>
              `;
        });
        shop.innerHTML = `
              <h4>${key}</h4>
              ${menuList.join('')}
            `;
        shopListEle.appendChild(shop);
      });
    });
}

function bill(dish) {
  return fetch(apiUrl + 'order', {
    body: JSON.stringify(dish),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}

function order() {
  const user = document.querySelector('#user').value;
  const addr = document.querySelector('#addr').value;
  const telephone = document.querySelector('#telephone').value;
  if (!user) {
    alert('请输入姓名');
    return;
  }
  if (!addr) {
    alert('请输入地址');
    return;
  }
  if (!telephone) {
    alert('请输入电话');
    return;
  }

  const checkboxes = Array.from(
    document.querySelectorAll('input[type=checkbox]'),
  );
  const checked = checkboxes.filter((item) => item.checked);
  if (checked.length === 0) {
    alert('请选择菜品');
    return;
  }

  let shop_name = '';
  const dishList = checked.map((item) => {
    shop_name = item.dataset.shop;
    return {
      shop_name: item.dataset.shop,
      dish: item.dataset.dish,
      price: item.dataset.price,
    };
  });

  bill({
    user: user,
    addr: addr,
    shop_name: shop_name,
    telephone: telephone,
    dishList: dishList,
  }).then((res) => {
    alert(res.message);
  });
}

getDishList();
