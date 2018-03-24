import VueProgressBar from 'vue-progressbar'

const options = {
	color: '#F5A623',
	failedColor: 'red',
	thickness: '2px',
	transition: {
		speed: '0.2s',
		opacity: '0.6s',
		termination: 300
	},
}

export default function(Vue) {
	Vue.use(VueProgressBar, options)
}
