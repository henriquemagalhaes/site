module.exports = {
    name: "arquivo",
    label: "Arquivos",
    menu: "Conteúdo",
    onlyFor: ["admin"],
    cache: "elasticache",
    
    fields: [
        { name: "nome", label: "Nome", checks: "hasValue" },
        { name: "arquivo", label: "Arquivo", type: "file" }
    ],
    format: "{{nome}}"
}