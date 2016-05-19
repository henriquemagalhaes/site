module.exports = {
	name: "mensagem",
	label: "Mensagens",
	menu: "Mensagens",
	cache: "elasticache",
	
	fields: [
		{ name: "motivo", label: "Motivo" },
		{ name: "corpo", label: "Corpo da mensagem", type: "text" },
		{ name: "dataDeEnvio", label: "Data de Envio", type: "date" },
		{ name: "estado", label: "Estado", type: "category", options: [ "PENDENTE", "RESOLVIDO" ] },
		{ name: "codAssinante", label: "código do assinante" },
		{ name: "nomeAssinante", label: "Nome do assinante" },
		{ name: "emailResposta", label: "Email para resposta", type: "email" },
		{ name: "telefoneAssinante", label: "Telefone para resposta", type: "tel" }
	],
	format: "{{estado}} {{#nomeAssinante}}{{.}}{{/nomeAssinante}}{{^nomeAssinante}}{{emailResposta}}{{/nomeAssinante}}"
}