define(function(){
  function convertFilterData(data){
    var selectName = [],
        parents =[],
      selectOptions = {};

    convertData(data);

    function convertData(data, parent){
      //parent = parent || '';//原先第二个参数是parent  参数parent是一个值
      //但是现在应该记录下所有父元素
      if(parent){
        parents.push(parent);
      }
      if(!selectOptions[data.name]){
        selectOptions[data.name] = [];
        selectName.push(data.name);
      }

      _.each(data.items, function(ele, index){
        selectOptions[data.name].push({
          display_value: ele.display_value,
          //value: parents.length?parents.join()+','+ele.value:ele.value,
          value: ele.value,
          parent: parents.join()
        });
        if(ele.children){
          if(_.isArray(ele.children)){
            _.each(ele.children, function(child, idx){
              convertData(child, ele.value);
            });
          }else{
            convertData(ele.children, ele.value);
          }
        }
      });
      parents.pop();
    }
    return {
      selectName: selectName,
      selectOptions: selectOptions
    };
  }

  function convertSimpleFilterData(filterData){
    var convertData = {};
    convertData.values = filterData.values;
    convertData.defaultOption = filterData.defaultOption || filterData.values[0].display_value;
    convertData.values.forEach(function(item){
      if(item.name === undefined){
        item.name = filterData.name;
      }
      if(item.value === undefined){
        item.value = item.display_value;
      }
    });

    return convertData;
  }

  return {
    filter: convertFilterData,
    simpleFilter: convertSimpleFilterData
  }
});