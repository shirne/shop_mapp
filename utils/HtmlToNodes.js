const DEBUG = false
const ATTRS = {
    "class": true,
    "style": true
}
const TAGS = {
    "a": {
        type: "inline"
    },
    "abbr": {
        type: "inline"
    },
    "b": {
        type: "inline"
    },
    "blockquote": {
        type: "block"
    },
    "br": {
        type: "close"
    },
    "code": {
        type: "block"
    },
    "del": {
        type: "inline"
    },
    "div": {
        type: "block"
    },
    "dl": {
        type: "block",
        children:["dt","dd"]
    },
    "dt": {
        type: "block"
    },
    "dd": {
        type: "block"
    },
    "em": {
        type: "inline"
    },
    "fieldset": {
        type: "block"
    },
    "h1": {
        type: "block"
    },
    "h2": {
        type: "block"
    },
    "h3": {
        type: "block"
    },
    "h4": {
        type: "block"
    },
    "h5": {
        type: "block"
    },
    "h6": {
        type: "block"
    },
    "hr": {
        type: "close"
    },
    "i": {
        type: "inline"
    },
    "img": {
        type: "close",
        attrs: ["alt", "src", "height", "width"]
    },
    "ins": {
        type: "inline"
    },
    "label": {
        type: "inline"
    },
    "legend": {
        type: "inline"
    },
    "li": {
        type: "block"
    },
    "ol": {
        type: "block",
        children:["li"],
        attrs: ["start", "type"]
    },
    "p": {
        type: "block"
    },
    "q": {
        type: "inline"
    },
    "span": {
        type: "inline"
    },
    "strong": {
        type: "inline"
    },
    "sub": {
        type: "inline"
    },
    "sup": {
        type: "inline"
    },
    "table": {
        type: "block",
        children:["col","colgroup","thead","tbody","tfoot","tr"],
        attrs: ["width"]
    },
    "col": {
        type: "close",
        attrs: ["span", "width"]
    },
    "colgroup": {
        type: "block",
        children:["col"],
        attrs: ["span", "width"]
    },
    "tbody": {
        type: "block",
        children:["tr"]
    },
    "td": {
        type: "block",
        attrs: ["colspan", "height", "rowspan", "width"]
    },
    "tfoot": {
        type: "block",
        children:["tr"]
    },
    "th": {
        type: "block",
        attrs: ["colspan", "height", "rowspan", "width"]
    },
    "thead": {
        type: "block",
        children:["tr"]
    },
    "tr": {
        type: "block",
        children:["td","th"]
    },
    "ul": {
        type: "block",
        children:["li"]
    }
}
function createNode(tag,attrs){
    tag=tag.toLowerCase()
    if(!TAGS[tag])return null
    var node={
        type:"node",
        name:tag,
        isclosed:TAGS[tag].type=='close'?true:false,
        attrs:{}
    }
    if(TAGS[tag].type!='close'){
        node.children=[]
    }
    if(attrs){
        for(var i in attrs){
            let att=i.toLowerCase()
            if(ATTRS[att] || (TAGS[tag].attrs && TAGS[tag].attrs.indexOf(att)>-1)){
                node.attrs[att]=attrs[i]
            }
        }
    }

    return node
}
function createTextNode(text){
    return {
        type:"text",
        text:text
    }
}
function createAttr(attrstr){
    let attr = /([\w\-]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
    if(!attrstr)return null
    let attrs={}
    let match=attr.exec(attrstr)
    while(match){
        if(match[2]){
            attrs[match[1]]=match[2]
        }
        match=attr.exec(attrstr)
    }

    return attrs
}

function HtmlToNodes(content,onPush=null){
    if(DEBUG)console.log('start:',new Date().getTime())
    let startTag = /<(\w+)((?:\s+[\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/g,
		endTag = /<\/(\w+)[^>]*>/g
        
    content = content.replace(/&emsp;/ig,'　')

    let length=content.length
    let index=0,match=null,ematch=null
    let rootNode=createNode('div',null),cursor=[rootNode],cursorIndex=0
    let dropLayer=0
    let callback=typeof onPush=='function'

    match=startTag.exec(content) 
    ematch=endTag.exec(content)
    while( match || ematch ){
        let curNode=cursor[cursorIndex]
        if (DEBUG)console.log('curNode:',curNode)
        //下一个是开始标签
        if( match && (!ematch || match.index<ematch.index)){
            if (DEBUG)console.log('match:', match)
            if(dropLayer>0)dropLayer++
            if(dropLayer==0){
                if(match.index>index){
                    let text = content.substring(index, match.index)
                    if (TAGS[curNode.name].type=='block'){
                        text=text.trim()
                    }
                    if (text!=''){
                        curNode.children.push(createTextNode(text))
                    }
                }
                index=match.index+match[0].length
                let node=createNode(match[1],createAttr(match[2]))
                if(node){
                    
                    //如果是p标签遇到block元素直接闭合
                    if (curNode.name == 'p' && TAGS[node.name].type=='block'){
                        cursorIndex--
                    }
                    if(match[3]=='/')node.isclosed=true
                    if (DEBUG)console.log(TAGS[curNode.name])
                    //如果不是当前元素应有的子元素，则放到上一层
                    if (!TAGS[curNode.name].children ||
                        (TAGS[curNode.name].children && TAGS[curNode.name].children.indexOf(node.name)>-1)){
                        if (callback) onPush(node, curNode)
                        curNode.children.push(node)
                    }else{
                        var pIndex=cursorIndex-1
                        if(pIndex<0)pIndex=0
                        cursor[pIndex].children.push(node)
                    }
                    
                    if(!node.isclosed){
                        cursorIndex++
                        cursor[cursorIndex]=node
                    }
                }else{
                    //抛弃的元素
                    if(match[3]!='/'){
                        dropLayer++
                    }
                }
            }

            match=startTag.exec(content)
        //下一个是结束标签
        }else if(ematch){
            if (DEBUG)console.log('ematch:', ematch)
            if(dropLayer>0)dropLayer--
            if(dropLayer==0){
                if(ematch.index>index){
                    let text = content.substring(index, ematch.index)
                    if (TAGS[curNode.name].type == 'block') {
                        text = text.trim()
                    }
                    if (text != '' ) {
                        curNode.children.push(createTextNode(text))
                    }
                }
                index=ematch.index+ematch[0].length
                if (curNode.name==ematch[1]){
                    cursorIndex--
                    if(cursorIndex<0)cursorIndex=0
                }
            }
            
            ematch=endTag.exec(content)
        }
    }
    if(index<length){
        let text = content.substring(index, length)
        if (TAGS[cursor[cursorIndex].name].type == 'block') {
            text = text.trim()
        }
        if (text != '') {
            cursor[cursorIndex].children.push(createTextNode(text))
        }
    }
    if (DEBUG) console.log('end:', new Date().getTime())
    return rootNode.children
}
module.exports = {
    HtmlToNodes:HtmlToNodes
}