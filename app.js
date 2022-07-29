// Storage Controller
const StorageCtrl = (function(){
    
    // public methods
    return {
        storeItem: function(item){
            let items;
            // check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                // push new items
                items.push(item);
                // set ls
                localStorage.setItem('items' ,JSON.stringify(items));
            } else {

                // get what is already in ls 
                items = JSON.parse(localStorage.getItem('items'));

                // push new items
                items.push(item);

                // re set ls

                // set ls
                localStorage.setItem('items' ,JSON.stringify(items));
            }

            

        },
        getItemFromStorage: function(){
            let items;
            if(localStorage.getItem('items')=== null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage: function(updateItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updateItem.id === item.id){
                    items.splice(index, 1 ,updateItem);
                }
            });
            localStorage.setItem('items' ,JSON.stringify(items));
        },

        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items' ,JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }

    }
})();

// Item Controller
const ItemCtrl = (function(){
    //Item  Constructor
    const Item = function(id, name ,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;

    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    // Public method
    return {
        getItem: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // Create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID= 0;
            }

            // Calories to number
            calories =  parseInt(calories);

            // Create new item
            newItem = new Item(ID, name ,calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
        },

        deleteItem: function(id){
            // get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            // get index
            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index, 1);
        },

        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
          },
        getTotalCalories :function(){
            let total = 0;

            //Loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories; 
            });

            data.totalCalories = total;

            // Return total calories
            return  data.totalCalories;
        },
        getItemById: function(id){
            let found = null;

            // Loop through items
            data.items.forEach(function(item){
                if(item.id ===id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            // Calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },

        logData: function(){
            return data;
        }
    }
})();


// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addbtn: '.add-btn' ,
        updatebtn: '.update-btn' ,
        deletebtn: '.delete-btn' ,
        backbtn: '.back-btn' ,
        clearbtn: '.clear-btn',
        itemNameInput : '#item-name',
        itemCaloriesInput : '#item-calories',
        totalCalories : '.total-calories'

    }
    //Public Method
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
              html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>`;
            });
      

            // Insert List ITEM
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
    getItemInput: function(){
        return {
            name:document.querySelector(UISelectors.itemNameInput).value,
            calories:document.querySelector(UISelectors.itemCaloriesInput).value
        }
    },
    addListItem: function(item){
        // Show the list
        document.querySelector(UISelectors.itemList).style.display ='block';
        // Create li element
        const li = document.createElement('li');
        // Add class
        li.className ='collection-item';
        // Add ID
        li.id =`item-${item.id}`;

        // Add HTML
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;

        // Insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);
        
        // turn node list into array
        listItems = Array.from(listItems);

        listItems.forEach(function(listItems){
            const itemID = listItems.getAttribute('id');
            
            if(itemID === `item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>` ;
            }
        });
    
    },

    deleteListItem: function(id){
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();

    },

    clearInput: function(){
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
    },

    removeItems: function(){
        let listItems = document.querySelectorAll(UISelectors.listItems);

        // turn node list into array
        listItems = Array.from(listItems);

        listItems.forEach(function(item){
            item.remove();
        })
    },
    hideList: function(){
        document.querySelector(UISelectors.itemList).style.display ='none';
    },

    showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState : function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updatebtn).style.display ='none';
        document.querySelector(UISelectors.deletebtn).style.display ='none';
        document.querySelector(UISelectors.backbtn).style.display ='none';
        document.querySelector(UISelectors.addbtn).style.display ='inline';
    },

    showEditState : function(){
        document.querySelector(UISelectors.updatebtn).style.display ='inline';
        document.querySelector(UISelectors.deletebtn).style.display ='inline';
        document.querySelector(UISelectors.backbtn).style.display ='inline';
        document.querySelector(UISelectors.addbtn).style.display ='none';
    },

    getSelectors: function(){
        return UISelectors;
    }
    }
    
})();

// APP Controller
const App = (function(ItemCtrl, StorageCtrl ,UICtrl){
    // Load event listners 
    const loadEventListners = function(){
        // Get UI元件的 Selectors，For 之後 UICTRL ITEMCTRL使用
        const UISelectors = UICtrl.getSelectors();

        //Add item event  Addbutton 點選時執行itemAddSubmit 
        document.querySelector(UISelectors.addbtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter (keyCode/ which are deprecated)
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13  || e.which === 13  ){
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event 修改icon點選
        document.querySelector(UISelectors.itemList).addEventListener('click' , itemEditClick);
        
        // Update item event
        document.querySelector(UISelectors.updatebtn).addEventListener('click', itemUpdateSubmit);

        // delete item event 刪除鍵
        document.querySelector(UISelectors.deletebtn).addEventListener('click', itemDeleteSubmit);
        


        // Back button event 返回鍵
        document.querySelector(UISelectors.backbtn).addEventListener('click', UICtrl.clearEditState);
   
         // clear item event 清除全部
         document.querySelector(UISelectors.clearbtn).addEventListener('click', clearAllItemClick);
   
    }

    // Add item submit
    const itemAddSubmit = function(e){
        // Get form input from UI Controller 取得輸入的值
        const input = UICtrl.getItemInput();

        
        // Check for name and calorie input 檢查是否有都有輸入值，都有的話才執行
        if(input.name !== '' && input.calories !== ''){
         // Add item 執行ItemCtrl.additem
         const newItem = ItemCtrl.addItem(input.name, input.calories);
         // Add item to ui list
        UICtrl.addListItem(newItem);

        //  Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        // Store in localStorage
        StorageCtrl.storeItem(newItem);

        // Clear Fields
        UICtrl.clearInput();
        }
        e.preventDefault();
    }

    // Click edit item 點選修改筆
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listArr = listId.split('-');

            // Get the actual id
            const id = parseInt(listArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
        
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
      
            // Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updateItem = ItemCtrl.updateItem(input.name, input.calories);
        
        //Update UI
        UICtrl.updateListItem(updateItem);

        //  Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        // update local storage
        StorageCtrl.updateItemStorage(updateItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //  Delete button event
    const itemDeleteSubmit = function(e){
        // Get current item 
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //  Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        // delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    // Clear item event
    const clearAllItemClick = function(){
        //Delete all items from data stucture
        ItemCtrl.clearAllItems();

        //  Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        // remove from ui
        UICtrl.removeItems();

        // clear from ls
        StorageCtrl.clearItemsFromStorage();

        // hide ul
        UICtrl.hideList();

    }

    // Public methods
    return {
        init: function(){
            // Set initial state 設定起始狀態
            UICtrl.clearEditState();
            
            // Fetch items from data structure
            const items = ItemCtrl.getItem();


            // Check if any items
            //如果有沒有任何項目，不顯示
            if(items.length === 0){
            UICtrl.hideList();
            } else {
            // Populate list with items
            // 如果有項目則顯示再UI
            UICtrl.populateItemList(items);
            }

            //  Get total calories 取得totalcalories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to ui 將totalcalories顯示在ui
            UICtrl.showTotalCalories(totalCalories);

            // Load event listners
            loadEventListners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// initialize app
App.init();

