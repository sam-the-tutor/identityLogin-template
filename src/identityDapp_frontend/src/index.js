import { identityDapp_backend, createActor, canisterId } from "../../declarations/identityDapp_backend";
import {AuthClient} from "@dfinity/auth-client"
import {Actor, HttpAgent} from "@dfinity/agent";
import { Principal } from "@dfinity/principal";


let actor = identityDapp_backend;



const loginButton = document.getElementById("login");
loginButton.onclick = async (e) => {
    e.preventDefault();
 
  let authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      identityProvider: process.env.II_URL,
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  }
};



async function handleAuthenticated(authClient) {
  const identity = await authClient.getIdentity();
  const userPrincipal = await identity._principal.toString();

  const agent = new HttpAgent({identity})
  console.log("Agent:",agent)
  console.log("canister Id:",canisterId)
  console.log(userPrincipal);

  actor = createActor(canisterId, {
       agentOptions:{
            identity,
         },
       
     });

  return false;


  // ReactDOM.render(
  //   <App loggedInPrincipal={userPrincipal} />,
  //   document.getElementById("root")
  // );
}



const greetButton = document.getElementById("greet");
greetButton.onclick = async (e) => {
    e.preventDefault();

    greetButton.setAttribute("disabled", true);

    // Interact with backend actor, calling the greet method
    const greeting = await actor.greet();
    console.log("Agent func call", greeting)

    greetButton.removeAttribute("disabled");

    document.getElementById("greeting").innerText = greeting;

    return false;
};





// const loginButton = document.getElementById("login");
// loginButton.onclick = async (e) => {
//     e.preventDefault();

//     let authClient = await AuthClient.create();

//     await new Promise((resolve) => {
//         authClient.login({
//             identityProvider: process.env.II_URL,
//             onSuccess: resolve,
//         });
//     });

//     // At this point we're authenticated, and we can get the identity from the auth client:
//     const identity = authClient.getIdentity();
//     console.log("identity object",identity)
//     // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
//     const agent = new HttpAgent({identity});
//     /**
//      Using the interface description of our webapp, we create an actor that we use to call the service methods.
//       We override the global actor, such that the other button handler will automatically use 
//       the new actor with the Internet Identity provided delegation.
//      **/
//     actor = createActor(canisterId, {
//         agentOptions:{
//              agent,
//          },
       
//     });

//     return false;
// };



