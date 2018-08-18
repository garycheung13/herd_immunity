export default (function(){
    const form = [...document.querySelectorAll("#sim-settings input[type='range']")];
    // prefinding the elements so event doesn't trigger a dom search
    const displayElements = form.reduce(function(map, node){
        map[node.id] = document.getElementById(`${node.id}__display`);
        return map;
    }, {});

    form.map(function(node){
        node.addEventListener("input", function(e){
            displayElements[e.target.id].innerText = e.target.value;
        });
    })
})();