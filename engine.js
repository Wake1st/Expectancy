(async () => {
    const gameWrapper = document.getElementById('game-wrapper');
    const aboutWrapper = document.getElementById('about-wrapper');
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

    document.getElementById('game-nav').addEventListener('click', () => {
        gameWrapper.style.display = 'inline-block';
        aboutWrapper.style.display = 'none';
        animate('#description');
    });
    
    document.getElementById('about-nav').addEventListener('click', () => {
        gameWrapper.style.display = 'none';
        aboutWrapper.style.display = 'inline-block';
        animate('#about');
    });

    
    function createOption() {
        optionNode.classList.add('m-1','col-12');
    
        var choice = document.createElement('input');
        choice.type = 'button';
        choice.classList.add('btn','scary','btn-choice','text-wrap', 'option');
        
        optionNode.appendChild(choice);
    }
    
    function createDecision() {
        $(decisionNode).attr('id','decision')

        var p = document.createElement('p');
        $(p).attr('id','description');
        p.classList.add('text-wrap');
    
        var options = document.createElement('div');
        options.classList.add('justify-content-center','fade-in');
        $(options).attr('id','options');
    
        decisionNode.appendChild(p);
        decisionNode.appendChild(options);
    }
    
    
    function callDecision(element) {
        var optionId = $(element).attr("id").replace("choice_", "");
        addDecision(optionId);
        animate('#description');
    }
    
    function addDecision(Id) {
        var decision = data.find(({id}) => id === parseInt(Id));
        decision ??= data.find(({id}) => id === -1);
        
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
    

    $.fn.characterize = function (wrapper, options) {
        var txt = this.text(),
        self = this;
        
        this.empty();
        
        wrapper = wrapper || '<span />';
        options = options || {};
        
        Array.prototype.forEach.call(txt, function (c) {
          options.text = c;
          self.append($(wrapper, options));
        });
    };
    
    function animate (elementId) {
        var des = $(elementId);
        
        des.css('opacity', 0);
        
        des.characterize('<span />', {
            class: 'fd',
            css: {
                opacity: 0
            }
        });
        
        des.css('opacity', 1);
        
        $('.fd').each(function (i) {
            $(this).animate({opacity: 1}, (i + 1) * 20);
        });
    }
    

    createOption();
    createDecision();

    let savedId = sessionStorage.getItem(saveKey);
    addDecision(savedId ?? 0);
    animate('#description');
    
    $audio.animate({volume: newVolume}, 1000);
})();