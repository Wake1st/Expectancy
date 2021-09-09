(async () => {
    const gameContainer = document.getElementById('container');
    const decisionNode = document.createElement('div');
    const optionNode = document.createElement('div');
    const saveKey = 'expectancyDecisionId';

    let data;


    function readJson(path) {
        return fetch(path)
            .then(response => response.json());
    }
    
    data = await readJson('./decisions.json');
    
    gameContainer.addEventListener("click", (e) => {
        if ($(e.target).hasClass('btn-choice'))
            callDecision(e.target);
        else
            console.log("non functioning: " + e.target);
    });


    function createOption() {
        optionNode.classList.add('m-1','col-12');
    
        var choice = document.createElement('input');
        choice.type = 'button';
        choice.classList.add('btn','btn-dark','btn-choice','text-wrap');
        
        optionNode.appendChild(choice);
    }
    
    function createDecision() {
        decisionNode.classList.toggle('fade-in');
    
        var p = document.createElement('p');
        $(p).attr('id','description');
        p.classList.add('text-wrap');
    
        var options = document.createElement('div');
        options.classList.toggle('justify-content-center');
        $(options).attr('id','options');
    
        decisionNode.appendChild(p);
        decisionNode.appendChild(options);
    }
    
    
    function callDecision(element) {
        var optionId = $(element).attr("id").replace("choice_", "");
        addDecision(optionId);
    }
    
    function addDecision(Id) {
        var decision = data.find(({id}) => id === parseInt(Id));
        decision ??= data.find(({id}) => id === -1);
        //console.log(Id, decision);
        
        sessionStorage.setItem(saveKey,decision.id);

        $(decisionNode).children('p').text(decision.description);
        $(decisionNode).children('#options').empty();
        addOptions(decision.options);
        
        $('#decisions').empty().html(decisionNode);
    }
    
    function addOptions(options) {
        options.forEach(op => {
            var node = optionNode.cloneNode(true);

            var button = $(node).children('.btn')
            button.val(op.text);
            button.attr('id',`choice_${op.id}`);

            $(decisionNode).children('#options').append(node);
        });
    }
    
    
    createOption();
    createDecision();

    let savedId = sessionStorage.getItem(saveKey);
    addDecision(savedId ?? 0);
})();