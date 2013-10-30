var Exercise = Backbone.Model.extend( {
	url: function () {
		return '/exercises'
	},
	validate: function () {
	}
} );

Exercise.Collection = Backbone.Collection.extend( {
	model: Exercise
} );

var ExerciseList = Backbone.View.extend( {
	initialize: function () {
		this.listenTo(
			this.collection,
			'add',
			this.render.bind( this )
		);
	},
	tagName: 'ul',
	template: _.template( document.querySelector( '#exercise_list' ).innerHTML ),
	render: function () {
		this.el.innerHTML = this.template( {
			exercises: this.collection
		} );
	}
} );

var ExerciseForm = Backbone.View.extend( {
	initialize: function () {
		this.listenTo(
			this.collection,
			'add',
			this.render.bind( this )
		);
	},
	tagName: 'form',
	events: {
		'submit': 'addExercise'
	},
	template: _.template( document.querySelector( '#form' ).innerHTML ),
	render: function () {
		this.el.innerHTML = this.template();
	},
	addExercise: function ( event ) {
		event.preventDefault();

		var name = this.$( '[name=name]' ).val();

		this.collection.add( [{ name: name }] );
	}
} );

var AppRouer = Backbone.Router.extend( {
	routes: {
		'': 'list',
		'/form': 'form'
	},
	initialize: function ( opts ) {
		this.rootEl = opts.el;
		this.listView = opts.list;
		this.formView = opts.form;
	},
	list: function () {
		this.rootEl.html( this.listView.el );
	},
	form: function () {
		this.rootEl.html( this.formView.el );
	}
} );

function main () {
	var a = new Exercise( { name: 'curl', reps: 5, sets: 5} ),
		b = new Exercise( { name: 'pushups', reps: 12, sets: 3} ),
		c = new Exercise( { name: 'deadlift', reps: 2, sets: 2} ),
		exercises, exercisesView, exercisesFormView;

	exercises = new Exercise.Collection( [a, b, c] );

	exercisesView = new ExerciseList( {
		collection: exercises
	} );
	exercisesView.render();
	// document.body.appendChild(exercisesView.el);

	exercisesFormView = new ExerciseForm( {
		collection: exercises
	} );
	exercisesFormView.render();
	// document.body.appendChild(exercisesFormView.el);

	var router = new AppRouer( {
		el: $(document.body),
		list: exercisesView,
		form: exercisesFormView
	} );

	Backbone.history.start({pushState:false,root:""});
}

main();