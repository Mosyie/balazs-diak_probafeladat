// select canvas (játék végi kép)


// randomizált képek tömbje
let currentImages = [];

// játéktérben lévő divek
const firstDiv = document.querySelector(".div_first");
const secondDiv = document.querySelector(".div_second.pool");

addEventListener("load", () =>{
    createContainers();
    createPool();
})

function createContainers()
{
    // felső tárolókonténerek
    for(let i = 0; i < 3; i++)
    {
        const div = document.createElement("div");
        const left_offset = 680 * i;
        div.classList.add("container_div")
        div.style.left = left_offset + "px";
        
        // mindegyikhez hozzárendeljük ugyanazt az eseménykezelőt
        div.addEventListener("click",clickedContainer)
        firstDiv.append(div);
    }
}

function createPool()
{
    // invariáns: ha az images kevesebb mint 6 elemű akkor végtelen ciklus
    if(images.length >= 6)
    {
        while(currentImages.length < 6)
        {
            // amennyiben bővül az images tömb, ez még mindig jól működik
            const imageNumber = random(0,images.length - 1)
            if(!currentImages.includes(images[imageNumber].groupname))
            {
                currentImages.push(images[imageNumber].groupname);
            }
        }
        for(let i = 0; i < 6; i++)
        {
            // div minden gyümölcshöz, és appendeljük a képet a megfelelő stílusosztályokkal
            const div = document.createElement("div");
            div.classList.add("image_div");
            // eseménykezelő rákattintáshoz
            div.addEventListener("click", clickedFruit);

            const image = document.createElement("img");
            image.src = "images/" + currentImages[i];
            image.classList.add("image_inside_pool");

            div.appendChild(image);
            secondDiv.appendChild(div);
        }
    }
    else
    {
        return;
    }
}

function clickedContainer()
{   
    if(this.children.length <= 1)
    {
        for(let i = 0; i < 6; i++)
        {
            if(secondDiv.children[i].classList.contains("selected_div"))
            {
                secondDiv.children[i].classList.remove("selected_div");

                // a node-ot klónozzuk, hogy ne a konkrét eleme kerüljön a konténerbe
                const selected_fruit = secondDiv.children[i].cloneNode(true);
                selected_fruit.classList.remove("image_div")
                selected_fruit.classList.add("container_div_element")

                for(let i = 0; i < images.length; i++)
                {
                    // fájl elérési út
                    let path = selected_fruit.children[0].src.split("/");
                    if(images[i].groupname === path[path.length-1])
                    {
                        // a group helyett a sima képet szúrjuk be
                        selected_fruit.children[0].src = "images/" + images[i].name
                        selected_fruit.children[0].classList.remove("image_inside_pool");
                        // a konténerből is át tudjuk rakni
                        selected_fruit.children[0].addEventListener("click",clickedFruit)
                        
                        break;
                    }
                }
                this.append(selected_fruit)
                secondDiv.children[i].classList.add("opacity");
            }

        }

        // konténerből kontérebe esetkor nincs copy
        let iIndex = -1;
        let jIndex = -1
        for(let i = 0; i < 3; i++)
        {   
            for(let j = 0; j < firstDiv.children[i].childElementCount; j++)
            {
                if(firstDiv.children[i].children[j].classList.contains("selected_div"))
                {
                    iIndex = i;
                    jIndex = j;
                    break;
                }
            }
        }
        if(iIndex !== -1 && jIndex !== -1)
        {   
            selected_fruit = firstDiv.children[iIndex].children[jIndex];
            if(this !== selected_fruit.parentNode)
            {
                firstDiv.children[iIndex].children[jIndex].classList.remove("selected_div");
                this.append(selected_fruit)
            }
        }


    
    let gameOver = true
    for(let i = 0; i < 3; i++)
    {
        if(firstDiv.children[i].childElementCount !== 2)
        {
            gameOver = false;
            break;
        }
    }
    
    if(gameOver)
    {
        const wrapperDiv = document.querySelector(".wrapper");
        wrapperDiv.classList.remove("wrapper")

        const gameOverDiv = document.createElement("div");
        gameOverDiv.classList.add("game_over_div")

        const image = document.createElement("img");
        image.src = "images/star.svg";
        image.style.width = "250px";
        image.style.height = "250px";
        gameOverDiv.appendChild(image);
        
       
        wrapperDiv.insertBefore(gameOverDiv,wrapperDiv.firstChild);
        wrapperDiv.removeChild(firstDiv);
        wrapperDiv.removeChild(secondDiv);
    }
}
}

function clickedFruit()
{
    if(this.classList.contains("opacity"))
        return;
        //amint rányomunk az egyik divre mindegyikről törli a stílusosztályt, és csak a clickeltre teszi rá
    for(let i = 0; i < 6; i++)
    {   
        if(secondDiv.children[i].classList.contains("selected_div"))
        {
            secondDiv.children[i].classList.remove("selected_div");
        }
    }
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < firstDiv.children[i].childElementCount; j++)
        {
            // a konténerből is át tudjuk rakni
            //firstDiv -> i. konténer -> j. elem a konténeren belül
            
            if(firstDiv.children[i].children[j].classList.contains("selected_div"))
            {
                firstDiv.children[i].children[j].classList.remove("selected_div");
            }
        }
    }
    if(this.tagName === "DIV")
    {
        this.classList.add("selected_div");
    }
    else if(this.tagName === "IMG")
    {
        this.parentNode.classList.add("selected_div");
    }
}

// random szám generátor [a,b] intervallumon
function random(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
 }