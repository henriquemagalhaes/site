module.exports = {
    name: "banner",
    label: "Banner",
    menu: "Conteúdo",
    onlyFor: ["admin"],
    cache: "elasticache",
    
    fields: [
        { name: "nome", label: "Nome", checks: "hasValue" },
        { name: "imagem", label: "Imagem", type: "image" },
        { name: "descricao", label: "Descrição", type: "html" },
        { name: "cor", label: "Cor", type: "combo", of: [ "dark", "bright", "green", "blue", "orange", "pink" ] },
        { name: "horizontal", label: "Alinhamento Horizontal", type: "combo", of: [ "left", "right" ] },
        { name: "vertical", label: "Alinhamento Vertical", type: "combo", of: [ "top", "bottom" ] },
        { name: "assinantes", label: "Mostrar para assinantes", type: "boolean" },
        { name: "naoAssinantes", label: "Mostrar para não-assinantes", type: "boolean" },
        { name: "targetURL", label: "Ir para URL" },
        { name: "ordem", label: "Ordem" }
    ],
    format: "{{nome}}"
}