import "./Footer.css"
import Betrics from "../../images/Betrics.png"
import RotoWire from "../../images/RotoWire.jpg"
export default function Footer(){
    return(<div className="footerCss">
                <span style={{"margin-left":"3%"}}>
                    <abbr title="Game lines and odds provided by Betrics"><img id="betricsCss" src={Betrics} onClick={()=>{window.open("https://www.rotowire.com")}} /></abbr>
                </span>
                <span style={{"margin-left":"30%"}}>
                    <abbr title="Player news and stats provided by Rotowire" ><img id="rotowireCss" src={RotoWire} onClick={()=>{window.open("https://www.betrics.io")}} /></abbr>
                </span>
            
    </div>
    )
}