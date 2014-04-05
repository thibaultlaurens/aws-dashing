components = ['Paradigm shift', 'Leverage', 'Pivoting', 'Turn-key', 'Streamlininess', 'Exit strategy', 'Synergy', 'Enterprise', 'Web 2.0']
component_counts = {}

setInterval () ->
    random_buzzword = components[Math.floor(Math.random() * components.length)]
    value = component_counts[random_buzzword] && component_counts[random_buzzword].value || 0
    component_counts[random_buzzword] =
      label: random_buzzword,
      value: (value + 1) % 30

    data = []
    for i in component_counts
      data.push component_counts[i]

    send_event 'components', { items: data }
  , 2 * 1000
