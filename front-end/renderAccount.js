const template = ({ address, balance }) => `
    <div class="address">
        Address: ${address}
    </div>
    <div class="balance">
        Balance: ${balance} 
    </div>
    <div class="createNewGame" id="createNewGame">
       Start a New Game
    </div>  
    <div class="joinGame" id="joinGame">
        Join a game   
    </div> 
    <div class="logout" id="logout">
        logout
    </div>  
`;

async function renderAccount(props, decrementHandler, joinHandler, logout) {
    const html = template(props); // same
    document.getElementById("account").innerHTML = html; // same
    document.getElementById("createNewGame").addEventListener('click', () => {
        decrementHandler();
    });
    //document.getElementById("account").innerHTML = html;
    document.getElementById("joinGame").addEventListener('click', () => {
        joinHandler();
    });
    
    document.getElementById("logout").addEventListener('click', () => {
        document.getElementById("account").innerHTML = "";
        logout();
    });
}

export default renderAccount;