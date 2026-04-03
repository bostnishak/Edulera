/* ============= data.js — Course Seed Data & localStorage Helpers ============= */
(function () {
    const COURSES = [
        {
            id: 'c1', title: 'Modern Web Development: HTML, CSS & JavaScript', category: 'Web Development',
            instructor: 'Ahmet Yilmaz', price: 299, oldPrice: 599,
            rating: 4.8, ratingCount: 2341, students: 8921,
            emoji: '💻', gradient: 'linear-gradient(135deg,#4263eb,#3b82f6)',
            description: 'Learn modern web technologies from scratch. Covers everything from the fundamentals of HTML5, CSS3, and JavaScript to advanced topics.',
            whatLearn: ['Using HTML5 semantic structure', 'Responsive design with CSS Grid and Flexbox', 'Modern JavaScript ES6+ syntax', 'DOM manipulation and API integration', 'Building real-world projects'],
            lessons: [
                { id: 'l1', title: 'Introduction to the Web & Environment Setup', duration: '12 min' },
                { id: 'l2', title: 'HTML5 Fundamentals and Semantic Elements', duration: '28 min' },
                { id: 'l3', title: 'Styling with CSS3', duration: '35 min' },
                { id: 'l4', title: 'CSS Grid and Flexbox', duration: '40 min' },
                { id: 'l5', title: 'Introduction to JavaScript', duration: '30 min' },
                { id: 'l6', title: 'ES6+ Features', duration: '25 min' },
                { id: 'l7', title: 'DOM Manipulation', duration: '32 min' },
                { id: 'l8', title: 'Asynchronous JavaScript and APIs', duration: '38 min' },
            ],
            quiz: [
                { q: 'Which HTML tag defines the page title?', type: 'mc', opts: ['<title>', '<head>', '<header>', '<meta>'], ans: 0 },
                { q: 'What does "display: flex" do in CSS?', type: 'mc', opts: ['Hides the element', 'Creates a flexible box layout', 'Enlarges the element', 'Changes color'], ans: 1 },
                { q: 'The difference between "let" and "var" in JavaScript is block scope.', type: 'tf', ans: true },
                { q: 'Which property is used to create a 3-column layout with CSS Grid?', type: 'mc', opts: ['grid-template-rows', 'grid-template-columns', 'grid-gap', 'grid-auto-flow'], ans: 1 },
                { q: 'Which HTTP method is used to securely submit form data in HTML?', type: 'mc', opts: ['GET', 'POST', 'PUT', 'DELETE'], ans: 1 },
                { q: 'The "===" operator in JavaScript compares both value and type.', type: 'tf', ans: true },
                { q: 'Which value is used to center an element with CSS?', type: 'mc', opts: ['margin:auto', 'padding:center', 'align:middle', 'position:center'], ans: 0 },
                { q: 'What does the fetch() function return?', type: 'mc', opts: ['Array', 'Promise', 'Object', 'String'], ans: 1 },
                { q: 'What HTML tag is used for images?', type: 'fill', ans: 'img' },
                { q: 'What property gives the length of a JavaScript array?', type: 'fill', ans: 'length' },
            ]
        },
        {
            id: 'c2', title: 'Modern Frontend Development with React.js', category: 'Web Development',
            instructor: 'Zeynep Kara', price: 399, oldPrice: 799,
            rating: 4.9, ratingCount: 1876, students: 6543,
            emoji: '⚛️', gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
            description: 'Build component-based modern web applications with React.js. Learn Hooks, Context API, Redux, and more.',
            whatLearn: ['React component architecture', 'useState and useEffect hooks', 'State management with Context API', 'Building SPAs with React Router', 'API integration and async operations'],
            lessons: [
                { id: 'l1', title: 'Introduction to React & Setup', duration: '15 min' },
                { id: 'l2', title: 'JSX and Component Basics', duration: '25 min' },
                { id: 'l3', title: 'Props and State Management', duration: '35 min' },
                { id: 'l4', title: 'React Hooks: useState & useEffect', duration: '40 min' },
                { id: 'l5', title: 'Context API', duration: '30 min' },
                { id: 'l6', title: 'React Router', duration: '28 min' },
                { id: 'l7', title: 'API Integration', duration: '35 min' },
            ],
            quiz: [
                { q: 'Which hook is used to manage a component\'s state in React?', type: 'mc', opts: ['useEffect', 'useState', 'useContext', 'useRef'], ans: 1 },
                { q: 'JSX is an extension of JavaScript.', type: 'tf', ans: true },
                { q: 'Props are mutable objects in React.', type: 'tf', ans: false },
                { q: 'When does useEffect run?', type: 'mc', opts: ['Only on first render', 'On every render', 'When specified dependencies change', 'Options A and C'], ans: 3 },
                { q: 'What is the key prop used for in React?', type: 'mc', opts: ['Styling', 'Identifying list elements', 'Listening to events', 'Creating refs'], ans: 1 },
                { q: 'Context API is used for global state management.', type: 'tf', ans: true },
                { q: 'Which component is used for navigation between pages in React Router?', type: 'mc', opts: ['<Link>', '<a>', '<Navigate>', '<Route>'], ans: 0 },
                { q: 'Which lifecycle method is used to make API calls in React?', type: 'mc', opts: ['componentWillMount', 'useEffect', 'useState', 'componentDidRender'], ans: 1 },
                { q: 'Which keyword is used to create a function component in React?', type: 'fill', ans: 'function' },
                { q: 'What method is used to update the virtual DOM in React?', type: 'fill', ans: 'render' },
            ]
        },
        {
            id: 'c3', title: 'Data Science & Machine Learning with Python', category: 'Data Science',
            instructor: 'Dr. Mehmet Sahin', price: 449, oldPrice: 899,
            rating: 4.7, ratingCount: 3102, students: 12341,
            emoji: '🐍', gradient: 'linear-gradient(135deg,#10b981,#3b82f6)',
            description: 'Learn to develop data analysis, visualization, and machine learning models using Python.',
            whatLearn: ['Python programming fundamentals', 'Data analysis with NumPy and Pandas', 'Visualization with Matplotlib and Seaborn', 'ML models with Scikit-learn', 'Working with real datasets'],
            lessons: [
                { id: 'l1', title: 'Introduction to Python', duration: '20 min' },
                { id: 'l2', title: 'Numerical Operations with NumPy', duration: '35 min' },
                { id: 'l3', title: 'Data Analysis with Pandas', duration: '45 min' },
                { id: 'l4', title: 'Data Visualization', duration: '30 min' },
                { id: 'l5', title: 'Introduction to Machine Learning', duration: '40 min' },
                { id: 'l6', title: 'Regression Models', duration: '38 min' },
                { id: 'l7', title: 'Classification Algorithms', duration: '42 min' },
            ],
            quiz: [
                { q: 'Which brackets are used to create a list in Python?', type: 'mc', opts: ['{}', '()', '[]', '<>'], ans: 2 },
                { q: 'A DataFrame in Pandas is a two-dimensional data structure.', type: 'tf', ans: true },
                { q: 'Which function is used to create an array in NumPy?', type: 'mc', opts: ['np.list()', 'np.array()', 'np.create()', 'np.make()'], ans: 1 },
                { q: 'What does overfitting mean in machine learning?', type: 'mc', opts: ['Model learned nothing', 'Model is good on test but bad on training', 'Model overfit to training data', 'Model is too fast'], ans: 2 },
                { q: 'Python\'s for loop can be used with the range() function.', type: 'tf', ans: true },
                { q: 'Which method is used to train a model in Scikit-learn?', type: 'mc', opts: ['train()', 'learn()', 'fit()', 'predict()'], ans: 2 },
                { q: 'The correlation coefficient ranges from -1 to 1.', type: 'tf', ans: true },
                { q: 'Which structure is used to create a dictionary in Python?', type: 'mc', opts: ['[]', '()', '{}', '<>'], ans: 2 },
                { q: 'What is a common method for data normalization?', type: 'fill', ans: 'normalization' },
                { q: 'The print function outputs data in Python.', type: 'tf', ans: true },
            ]
        },
        {
            id: 'c4', title: 'Deep Learning and Artificial Intelligence', category: 'Data Science',
            instructor: 'Prof. Elif Demir', price: 499, oldPrice: 999,
            rating: 4.6, ratingCount: 987, students: 4231,
            emoji: '🤖', gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
            description: 'Design and implement neural networks and deep learning models using TensorFlow and Keras.',
            whatLearn: ['Fundamentals of artificial neural networks', 'Using TensorFlow and Keras', 'Image classification with CNN', 'Time series analysis with RNN', 'Transfer learning techniques'],
            lessons: [
                { id: 'l1', title: 'Introduction to Artificial Intelligence', duration: '18 min' },
                { id: 'l2', title: 'Neural Network Fundamentals', duration: '35 min' },
                { id: 'l3', title: 'TensorFlow Setup and Usage', duration: '28 min' },
                { id: 'l4', title: 'CNN: Convolutional Neural Networks', duration: '45 min' },
                { id: 'l5', title: 'RNN and LSTM', duration: '40 min' },
                { id: 'l6', title: 'Transfer Learning', duration: '32 min' },
            ],
            quiz: [
                { q: 'What is the purpose of an activation function in neural networks?', type: 'mc', opts: ['Increase speed', 'Model non-linear relationships', 'Reduce memory', 'Normalize data'], ans: 1 },
                { q: 'CNNs are commonly used in image processing.', type: 'tf', ans: true },
                { q: 'The ReLU activation function sets negative values to zero.', type: 'tf', ans: true },
                { q: 'What does backpropagation do?', type: 'mc', opts: ['Loads data', 'Updates weights', 'Saves model', 'Normalizes data'], ans: 1 },
                { q: 'Dropout layers are used to prevent overfitting.', type: 'tf', ans: true },
                { q: 'Which API is used to build models in TensorFlow?', type: 'mc', opts: ['tf.build()', 'tf.model()', 'tf.keras', 'tf.nn'], ans: 2 },
                { q: 'Transfer learning uses pre-trained models.', type: 'tf', ans: true },
                { q: 'What type of data is LSTM ideal for?', type: 'mc', opts: ['Image data', 'Sequential/time series data', 'Tabular data', 'Audio data'], ans: 1 },
                { q: 'As the number of layers increases in deep learning, the model becomes more complex.', type: 'tf', ans: true },
                { q: 'Keras is a high-level API built on top of which framework?', type: 'fill', ans: 'TensorFlow' },
            ]
        },
        {
            id: 'c5', title: 'UI/UX Design: Professional Interfaces with Figma', category: 'Design',
            instructor: 'Selin Arslan', price: 349, oldPrice: 699,
            rating: 4.9, ratingCount: 2109, students: 9876,
            emoji: '🎨', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
            description: 'Design professional user interfaces and experiences using Figma. Learn the full process from wireframe to prototype.',
            whatLearn: ['Mastering all Figma tools', 'Creating wireframes and mockups', 'Designing components and design systems', 'Building prototypes and animations', 'User research and testing'],
            lessons: [
                { id: 'l1', title: 'Introduction to Figma & Interface', duration: '15 min' },
                { id: 'l2', title: 'Basic Design Tools', duration: '30 min' },
                { id: 'l3', title: 'Component System', duration: '35 min' },
                { id: 'l4', title: 'Responsive Design with Auto Layout', duration: '28 min' },
                { id: 'l5', title: 'Creating Prototypes', duration: '25 min' },
                { id: 'l6', title: 'Building a Design System', duration: '40 min' },
                { id: 'l7', title: 'User Testing and Feedback', duration: '22 min' },
            ],
            quiz: [
                { q: 'What is a "wireframe" in UX design?', type: 'mc', opts: ['Final design', 'Skeletal/draft interface', 'Color palette', 'Typography'], ans: 1 },
                { q: 'Which shortcut is used to create a component in Figma?', type: 'mc', opts: ['Ctrl+G', 'Ctrl+K', 'Ctrl+Alt+K', 'Ctrl+C'], ans: 2 },
                { q: 'UX stands for User Experience, and UI stands for User Interface.', type: 'tf', ans: true },
                { q: 'What is a Design System?', type: 'mc', opts: ['A software program', 'A set of consistent design components and rules', 'Only a color palette', 'Only a typography collection'], ans: 1 },
                { q: 'A prototype creates an interactive demo without writing real code.', type: 'tf', ans: true },
                { q: 'What is the 8px grid used for?', type: 'mc', opts: ['Color selection', 'Consistent alignment and spacing', 'Font size', 'Image size'], ans: 1 },
                { q: 'Which CSS property does the Auto Layout feature resemble?', type: 'mc', opts: ['position:absolute', 'display:grid', 'display:flex', 'overflow:hidden'], ans: 2 },
                { q: 'At which stage of the design process is user research conducted?', type: 'mc', opts: ['Only at the end', 'Before starting and throughout', 'Only at the beginning', 'Never'], ans: 1 },
                { q: 'Figma is a web-based design tool.', type: 'tf', ans: true },
                { q: 'Contrast ratio in UI design is important for accessibility.', type: 'tf', ans: true },
            ]
        },
        {
            id: 'c6', title: 'Graphic Design: Adobe Photoshop & Illustrator', category: 'Design',
            instructor: 'Can Ozturk', price: 399, oldPrice: 799,
            rating: 4.7, ratingCount: 1543, students: 7234,
            emoji: '🖼️', gradient: 'linear-gradient(135deg,#ec4899,#f59e0b)',
            description: 'Create professional graphic designs using Adobe Photoshop and Illustrator. Learn logo, poster, and digital content creation.',
            whatLearn: ['Photo editing with Photoshop', 'Creating vector graphics', 'Designing logos and brand identities', 'Differences between print and digital design', 'Color theory and typography'],
            lessons: [
                { id: 'l1', title: 'Photoshop Fundamentals', duration: '25 min' },
                { id: 'l2', title: 'Layers and Masks', duration: '30 min' },
                { id: 'l3', title: 'Introduction to Illustrator', duration: '20 min' },
                { id: 'l4', title: 'Vector Drawing Tools', duration: '35 min' },
                { id: 'l5', title: 'Logo Design', duration: '40 min' },
                { id: 'l6', title: 'Color Theory and Typography', duration: '28 min' },
            ],
            quiz: [
                { q: 'Which tool is used to remove the background in Photoshop?', type: 'mc', opts: ['Crop Tool', 'Magic Wand', 'Brush Tool', 'Text Tool'], ans: 1 },
                { q: 'Vector graphics do not lose quality when enlarged.', type: 'tf', ans: true },
                { q: 'The CMYK color mode is used for which medium?', type: 'mc', opts: ['Web', 'Screen', 'Print', 'Mobile'], ans: 2 },
                { q: 'What is the file extension for Photoshop files?', type: 'fill', ans: 'psd' },
                { q: 'Vector format is preferred for logo design.', type: 'tf', ans: true },
                { q: 'What does kerning mean?', type: 'mc', opts: ['Line spacing', 'Letter spacing', 'Word spacing', 'Paragraph spacing'], ans: 1 },
                { q: 'How many colors does the RGB color model consist of?', type: 'mc', opts: ['2', '3', '4', '6'], ans: 1 },
                { q: 'What is the file extension for Illustrator files?', type: 'fill', ans: 'ai' },
                { q: 'The Pantone color system is a standard in the print industry.', type: 'tf', ans: true },
                { q: 'A disadvantage of bitmap (raster) graphics is that they degrade when enlarged.', type: 'tf', ans: true },
            ]
        },
        {
            id: 'c7', title: 'Digital Marketing & SEO Mastery', category: 'Marketing',
            instructor: 'Ayse Koc', price: 299, oldPrice: 599,
            rating: 4.8, ratingCount: 2876, students: 14532,
            emoji: '📈', gradient: 'linear-gradient(135deg,#10b981,#f59e0b)',
            description: 'Learn all digital marketing channels: SEO, social media, content marketing, email, and Google Ads.',
            whatLearn: ['SEO fundamentals and advanced techniques', 'Using Google Analytics', 'Social media strategies', 'Email marketing', 'Managing Google and Meta Ads'],
            lessons: [
                { id: 'l1', title: 'Introduction to Digital Marketing', duration: '18 min' },
                { id: 'l2', title: 'SEO: Search Engine Optimization', duration: '40 min' },
                { id: 'l3', title: 'Google Analytics', duration: '30 min' },
                { id: 'l4', title: 'Social Media Marketing', duration: '35 min' },
                { id: 'l5', title: 'Content Marketing', duration: '28 min' },
                { id: 'l6', title: 'Email Marketing', duration: '25 min' },
                { id: 'l7', title: 'Google Ads Fundamentals', duration: '38 min' },
                { id: 'l8', title: 'Conversion Optimization', duration: '32 min' },
            ],
            quiz: [
                { q: 'What does "backlink" mean in SEO?', type: 'mc', opts: ['Internal link', 'Link from another site', 'Image link', 'Video link'], ans: 1 },
                { q: 'Google Analytics is a free tool.', type: 'tf', ans: true },
                { q: 'What does CTR stand for?', type: 'mc', opts: ['Cost To Revenue', 'Click Through Rate', 'Content To Reader', 'Customer Traffic Rate'], ans: 1 },
                { q: 'How many characters should a meta description be in SEO?', type: 'mc', opts: ['50-60', '160-170', '300-400', '70-80'], ans: 1 },
                { q: 'Organic traffic is obtained through paid advertising.', type: 'tf', ans: false },
                { q: 'Which content type is most effective on social media?', type: 'mc', opts: ['Text only', 'Video content', 'Photo only', 'Polls'], ans: 1 },
                { q: 'In email marketing, what does "open rate" measure?', type: 'mc', opts: ['Clicks', 'People who opened the email', 'Buyers', 'Unsubscribers'], ans: 1 },
                { q: 'Content quality is important for ranking higher on Google.', type: 'tf', ans: true },
                { q: 'What does CPC (Cost Per Click) mean?', type: 'fill', ans: 'cost per click' },
                { q: 'ROI stands for Return on Investment.', type: 'tf', ans: true },
            ]
        },
        {
            id: 'c8', title: 'E-Commerce & Dropshipping Profits', category: 'Marketing',
            instructor: 'Burak Yildiz', price: 249, oldPrice: 499,
            rating: 4.5, ratingCount: 1234, students: 8765,
            emoji: '🛒', gradient: 'linear-gradient(135deg,#f59e0b,#4263eb)',
            description: 'Learn the secrets of setting up an e-commerce site, selecting products, the dropshipping model, and succeeding in online sales.',
            whatLearn: ['E-commerce business models', 'Setting up a store with Shopify', 'Product research and selection', 'How dropshipping works', 'Profit calculation and pricing'],
            lessons: [
                { id: 'l1', title: 'What is E-Commerce?', duration: '15 min' },
                { id: 'l2', title: 'Choosing a Business Model', duration: '22 min' },
                { id: 'l3', title: 'Building a Store with Shopify', duration: '35 min' },
                { id: 'l4', title: 'Product Research Techniques', duration: '30 min' },
                { id: 'l5', title: 'Dropshipping Fundamentals', duration: '28 min' },
                { id: 'l6', title: 'Payment Systems', duration: '20 min' },
                { id: 'l7', title: 'Marketing and Advertising', duration: '35 min' },
            ],
            quiz: [
                { q: 'In dropshipping, the seller holds product inventory.', type: 'tf', ans: false },
                { q: 'What is the conversion rate in e-commerce?', type: 'mc', opts: ['Rate of visitors converting to buyers', 'Profit margin', 'Return rate', 'Customer satisfaction'], ans: 0 },
                { q: 'What type of platform is Shopify?', type: 'mc', opts: ['Blog platform', 'E-commerce platform', 'Social media', 'Email'], ans: 1 },
                { q: 'B2B transactions involve sales between businesses.', type: 'tf', ans: true },
                { q: 'Product photo quality affects sales.', type: 'tf', ans: true },
                { q: 'What does Customer Lifetime Value (CLV) measure?', type: 'mc', opts: ['Revenue from a single sale', 'Total customer spending value', 'Return count', 'Ad cost'], ans: 1 },
                { q: 'An SSL certificate is mandatory for e-commerce sites.', type: 'tf', ans: true },
                { q: 'What should be done when cart abandonment rate is high?', type: 'mc', opts: ['Raise prices', 'Send reminder emails', 'Remove products', 'Shut down the site'], ans: 1 },
                { q: 'What does SKU stand for in e-commerce?', type: 'fill', ans: 'stock keeping unit' },
                { q: 'Customer reviews have a positive impact on sales.', type: 'tf', ans: true },
            ]
        },
        {
            id: 'c9', title: 'Backend Development with Node.js and Express', category: 'Web Development',
            instructor: 'Emre Celik', price: 399, oldPrice: 799,
            rating: 4.7, ratingCount: 1654, students: 7123,
            emoji: '🟩', gradient: 'linear-gradient(135deg,#10b981,#4263eb)',
            description: 'Build powerful REST APIs and backend systems using Node.js and the Express framework.',
            whatLearn: ['Node.js fundamentals', 'REST API with Express.js', 'MongoDB and Mongoose', 'Authentication with JWT', 'Deployment and hosting'],
            lessons: [
                { id: 'l1', title: 'Introduction to Node.js', duration: '20 min' },
                { id: 'l2', title: 'npm and Package Management', duration: '18 min' },
                { id: 'l3', title: 'Express.js Fundamentals', duration: '35 min' },
                { id: 'l4', title: 'REST API Design', duration: '40 min' },
                { id: 'l5', title: 'Databases with MongoDB', duration: '38 min' },
                { id: 'l6', title: 'JWT Authentication', duration: '30 min' },
                { id: 'l7', title: 'Middleware and Error Handling', duration: '25 min' },
            ],
            quiz: [
                { q: 'Which runtime does Node.js run on?', type: 'mc', opts: ['JVM', 'V8 Engine', 'Python Runtime', 'CLR'], ans: 1 },
                { q: 'Which HTTP method is used to delete a resource in a REST API?', type: 'mc', opts: ['GET', 'POST', 'PUT', 'DELETE'], ans: 3 },
                { q: 'MongoDB is a NoSQL database.', type: 'tf', ans: true },
                { q: 'What does JWT stand for?', type: 'mc', opts: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Token', 'Just Web Token'], ans: 1 },
                { q: 'npm stands for Node Package Manager.', type: 'tf', ans: true },
                { q: 'What is Express middleware?', type: 'mc', opts: ['A database', 'A function between request/response', 'A frontend library', 'A testing tool'], ans: 1 },
                { q: 'What does a 404 status code mean in a REST API?', type: 'mc', opts: ['Success', 'Unauthorized', 'Not Found', 'Server Error'], ans: 2 },
                { q: 'async/await syntax makes writing Promise-based code easier.', type: 'tf', ans: true },
                { q: 'Node.js runs JavaScript on the server side.', type: 'tf', ans: true },
                { q: 'Which method is used to define a POST route in Express?', type: 'fill', ans: 'app.post' },
            ]
        },
        {
            id: 'c10', title: 'Business Intelligence & Data Visualization with Power BI', category: 'Data Science',
            instructor: 'Fatma Yildirim', price: 349, oldPrice: 699,
            rating: 4.6, ratingCount: 876, students: 4512,
            emoji: '📊', gradient: 'linear-gradient(135deg,#f59e0b,#10b981)',
            description: 'Analyze business data and create interactive reports and dashboards using Power BI.',
            whatLearn: ['Using Power BI Desktop', 'Writing DAX formulas', 'Data modeling', 'Interactive dashboard design', 'Publishing with Power BI Service'],
            lessons: [
                { id: 'l1', title: 'Introduction to Power BI', duration: '18 min' },
                { id: 'l2', title: 'Importing and Transforming Data', duration: '30 min' },
                { id: 'l3', title: 'Building a Data Model', duration: '35 min' },
                { id: 'l4', title: 'DAX Fundamentals', duration: '40 min' },
                { id: 'l5', title: 'Visualization Types', duration: '28 min' },
                { id: 'l6', title: 'Dashboard Design', duration: '35 min' },
                { id: 'l7', title: 'Sharing and Publishing', duration: '22 min' },
            ],
            quiz: [
                { q: 'What does DAX stand for in Power BI?', type: 'mc', opts: ['Data Analysis Expressions', 'Dynamic Axis Expressions', 'Data Access Extension', 'Direct Access XML'], ans: 0 },
                { q: 'Power BI can be used for free.', type: 'tf', ans: true },
                { q: 'A dashboard and a report are the same concept.', type: 'tf', ans: false },
                { q: 'What does Power Query do?', type: 'mc', opts: ['Visualization', 'Data cleaning and transformation', 'DAX calculation', 'Sharing'], ans: 1 },
                { q: 'What operation does the SUM DAX function perform?', type: 'mc', opts: ['Averages', 'Counts', 'Sums', 'Finds maximum'], ans: 2 },
                { q: 'Star schema is used in database modeling.', type: 'tf', ans: true },
                { q: 'Which company developed Power BI?', type: 'mc', opts: ['Google', 'Apple', 'Microsoft', 'IBM'], ans: 2 },
                { q: 'KPI stands for Key Performance Indicator.', type: 'tf', ans: true },
                { q: 'What does a Slicer visual do?', type: 'mc', opts: ['Changes chart type', 'Filters the report page', 'Imports data', 'Writes DAX'], ans: 1 },
                { q: 'Power BI Service runs in which environment?', type: 'fill', ans: 'web' },
            ]
        },
        {
            id: 'c11', title: 'Mobile App Development with Flutter', category: 'Web Development',
            instructor: 'Ozan Gunes', price: 449, oldPrice: 899,
            rating: 4.8, ratingCount: 1432, students: 6789,
            emoji: '📱', gradient: 'linear-gradient(135deg,#06b6d4,#10b981)',
            description: 'Develop cross-platform mobile applications for iOS and Android with Flutter and Dart.',
            whatLearn: ['Dart programming language', 'Flutter widget system', 'State management', 'Firebase integration', 'Publishing to App Store and Google Play'],
            lessons: [
                { id: 'l1', title: 'Flutter Setup and Introduction', duration: '22 min' },
                { id: 'l2', title: 'Dart Fundamentals', duration: '35 min' },
                { id: 'l3', title: 'Widget Tree', duration: '30 min' },
                { id: 'l4', title: 'State Management', duration: '40 min' },
                { id: 'l5', title: 'Navigation and Routing', duration: '25 min' },
                { id: 'l6', title: 'Firebase Integration', duration: '38 min' },
                { id: 'l7', title: 'Publishing Process', duration: '28 min' },
            ],
            quiz: [
                { q: 'Which programming language is Flutter written in?', type: 'mc', opts: ['JavaScript', 'Kotlin', 'Dart', 'Swift'], ans: 2 },
                { q: 'Flutter enables development of cross-platform applications.', type: 'tf', ans: true },
                { q: 'In Flutter, everything is a Widget.', type: 'tf', ans: true },
                { q: 'When is setState() used?', type: 'mc', opts: ['When the app starts', 'To update the UI', 'When making network requests', 'To save data'], ans: 1 },
                { q: 'What type of service is Firebase?', type: 'mc', opts: ['Only a database', 'Backend-as-a-Service', 'Hosting service', 'CI/CD tool'], ans: 1 },
                { q: 'Hot reload speeds up Flutter development.', type: 'tf', ans: true },
                { q: 'Dart is a type-safe language.', type: 'tf', ans: true },
                { q: 'What does Navigator.push() do?', type: 'mc', opts: ['Goes back', 'Navigates to a new screen', 'Closes the app', 'Sends data'], ans: 1 },
                { q: 'Which widget is used to display a list in Flutter?', type: 'fill', ans: 'ListView' },
                { q: 'What information does the pubspec.yaml file contain?', type: 'mc', opts: ['Dart code', 'Dependencies and settings', 'Database', 'UI code'], ans: 1 },
            ]
        },
        {
            id: 'c12', title: 'Brand & Social Media Communications', category: 'Marketing',
            instructor: 'Nihan Polat', price: 199, oldPrice: 399,
            rating: 4.5, ratingCount: 2341, students: 11234,
            emoji: '📣', gradient: 'linear-gradient(135deg,#ec4899,#f59e0b)',
            description: 'Build a strong brand identity and manage social media professionally. Content strategy and community management.',
            whatLearn: ['Building a brand identity', 'Creating a content calendar', 'Instagram and TikTok strategy', 'Influencer collaborations', 'Analytics and reporting'],
            lessons: [
                { id: 'l1', title: 'What is a Brand and Why Does It Matter?', duration: '16 min' },
                { id: 'l2', title: 'Target Audience Analysis', duration: '25 min' },
                { id: 'l3', title: 'Content Strategy', duration: '30 min' },
                { id: 'l4', title: 'Instagram Masterclass', duration: '35 min' },
                { id: 'l5', title: 'TikTok and Short Video', duration: '28 min' },
                { id: 'l6', title: 'Influencer Marketing', duration: '22 min' },
                { id: 'l7', title: 'Community Management', duration: '20 min' },
                { id: 'l8', title: 'Analytics and Performance', duration: '25 min' },
            ],
            quiz: [
                { q: 'What does brand identity encompass?', type: 'mc', opts: ['Logo only', 'Colors only', 'Logo, colors, typography, and tone of voice', 'Slogan only'], ans: 2 },
                { q: 'Video is the content type that gets the most engagement on Instagram.', type: 'tf', ans: true },
                { q: 'Who is a micro-influencer in influencer marketing?', type: 'mc', opts: ['1M+ followers', '10K-100K followers', 'Celebrities only', 'Under 1K followers'], ans: 1 },
                { q: 'A content calendar enables planned publishing instead of chaos.', type: 'tf', ans: true },
                { q: 'Which factor does the TikTok algorithm prioritize?', type: 'mc', opts: ['Follower count', 'Watch time and engagement', 'Account age', 'Accounts followed'], ans: 1 },
                { q: 'Reach and impression are the same concept.', type: 'tf', ans: false },
                { q: 'What does UGC stand for?', type: 'mc', opts: ['User Generated Content', 'Unique Growth Channel', 'Ultra Global Campaign', 'User Guide Content'], ans: 0 },
                { q: 'What does social listening mean?', type: 'mc', opts: ['Recording audio', 'Tracking online conversations about your brand', 'Listening to podcasts', 'Customer interviews'], ans: 1 },
                { q: 'What does engagement rate measure?', type: 'fill', ans: 'engagement rate' },
                { q: 'Brand consistency builds trust.', type: 'tf', ans: true },
            ]
        },
    ];

    // Storage helpers
    const K = {
        users: 'lh_users',
        session: 'lh_session',
        enrollments: 'lh_enrollments',
        progress: 'lh_progress',
        certs: 'lh_certs',
        pending: 'lh_pending_content',
        customCourses: 'lh_custom_courses',
    };

    function get(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
    function set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

    function getCourses() { return COURSES; }

    /* getAllCourses merges seed data + approved corporate courses */
    function getAllCourses() {
        const custom = get(K.customCourses) || [];
        return [...COURSES, ...custom];
    }

    function getCourse(id) {
        return getAllCourses().find(c => c.id === id) || null;
    }

    /* ---- Corporate content submission ---- */
    function submitContent(data) {
        const all = get(K.pending) || [];
        const item = {
            id: 'pend_' + Date.now() + Math.random().toString(36).slice(2, 6),
            ...data,
            status: 'pending',
            submittedAt: new Date().toISOString(),
        };
        all.push(item);
        set(K.pending, all);
        return item;
    }

    function getPendingContent(filter) {
        const all = get(K.pending) || [];
        if (!filter) return all;
        return all.filter(item => {
            let match = true;
            if (filter.status && item.status !== filter.status) match = false;
            if (filter.category && item.category !== filter.category) match = false;
            if (filter.corporateName && !item.corporateName.toLowerCase().includes(filter.corporateName.toLowerCase())) match = false;
            return match;
        });
    }

    function approveContent(id) {
        const all = get(K.pending) || [];
        const idx = all.findIndex(p => p.id === id);
        if (idx === -1) return false;
        all[idx].status = 'approved';
        all[idx].approvedAt = new Date().toISOString();
        set(K.pending, all);
        /* Also add to custom courses so it appears in catalog */
        const item = all[idx];
        const custom = get(K.customCourses) || [];
        if (!custom.find(c => c.id === item.id)) {
            custom.push({
                id: item.id,
                title: item.title,
                category: item.category,
                instructor: item.corporateName || 'Corporate',
                price: item.price || 0,
                oldPrice: item.oldPrice || 0,
                rating: 0,
                ratingCount: 0,
                students: 0,
                emoji: item.emoji || '🎓',
                gradient: item.gradient || 'linear-gradient(135deg,#4263eb,#3b82f6)',
                description: item.description || '',
                whatLearn: item.whatLearn || [],
                lessons: item.lessons || [],
                quiz: item.quiz || [],
                videoUrl: item.videoUrl || '',
                isCorporate: true,
                corporateName: item.corporateName,
            });
            set(K.customCourses, custom);
        }
        return true;
    }

    function rejectContent(id, reason) {
        const all = get(K.pending) || [];
        const idx = all.findIndex(p => p.id === id);
        if (idx === -1) return false;
        all[idx].status = 'rejected';
        all[idx].rejectReason = reason || '';
        all[idx].rejectedAt = new Date().toISOString();
        set(K.pending, all);
        return true;
    }

    /* ---- Course editing (admin) ---- */
    function updateCourse(id, fields) {
        /* Try custom courses first */
        const custom = get(K.customCourses) || [];
        const ci = custom.findIndex(c => c.id === id);
        if (ci !== -1) {
            Object.assign(custom[ci], fields);
            set(K.customCourses, custom);
            return true;
        }
        /* Seed courses stored separately for edits */
        const edited = get('lh_edited_courses') || {};
        edited[id] = { ...(edited[id] || {}), ...fields };
        set('lh_edited_courses', edited);
        return true;
    }

    function deleteCourse(id) {
        /* From custom */
        const custom = get(K.customCourses) || [];
        const filtered = custom.filter(c => c.id !== id);
        if (filtered.length !== custom.length) {
            set(K.customCourses, filtered);
            return true;
        }
        /* Mark seed course as deleted */
        const deleted = get('lh_deleted_courses') || [];
        if (!deleted.includes(id)) { deleted.push(id); set('lh_deleted_courses', deleted); }
        return true;
    }

    function getEnrollments(userId) {
        const all = get(K.enrollments) || {};
        return all[userId] || [];
    }
    function enroll(userId, courseId) {
        const all = get(K.enrollments) || {};
        if (!all[userId]) all[userId] = [];
        if (!all[userId].includes(courseId)) all[userId].push(courseId);
        set(K.enrollments, all);
    }
    function isEnrolled(userId, courseId) {
        return getEnrollments(userId).includes(courseId);
    }

    function getProgress(userId, courseId) {
        const all = get(K.progress) || {};
        if (!all[userId]) all[userId] = {};
        if (!all[userId][courseId]) all[userId][courseId] = { completedLessons: [], quizPassed: false, quizScore: null, certEarned: false };
        return all[userId][courseId];
    }
    function saveProgress(userId, courseId, data) {
        const all = get(K.progress) || {};
        if (!all[userId]) all[userId] = {};
        all[userId][courseId] = data;
        set(K.progress, all);
    }

    function getCerts(userId) {
        const all = get(K.certs) || [];
        return all.filter(c => c.userId === userId);
    }
    function addCert(cert) {
        const all = get(K.certs) || [];
        // avoid duplicates
        const exists = all.find(c => c.userId === cert.userId && c.courseId === cert.courseId && c.type === cert.type);
        if (exists) return exists;
        const newCert = { ...cert, id: 'cert_' + Date.now(), date: new Date().toISOString() };
        all.push(newCert);
        set(K.certs, all);
        return newCert;
    }
    function getCert(certId) {
        const all = get(K.certs) || [];
        return all.find(c => c.id === certId) || null;
    }

    function starHTML(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
            else if (i - rating < 1) html += '<i class="fas fa-star-half-alt"></i>';
            else html += '<i class="far fa-star"></i>';
        }
        return html;
    }

    function toast(msg, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fas ${icons[type] || icons.info} toast-icon"></i><span class="toast-msg">${msg}</span>`;
        container.appendChild(t);
        setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, 3500);
    }

    function qs(id) { return document.getElementById(id); }
    function qsa(sel) { return document.querySelectorAll(sel); }

    window.LHData = {
        getCourses, getAllCourses, getCourse,
        getEnrollments, enroll, isEnrolled,
        getProgress, saveProgress,
        getCerts, addCert, getCert,
        submitContent, getPendingContent, approveContent, rejectContent,
        updateCourse, deleteCourse,
        starHTML, toast, qs, qsa,
        CATEGORIES: ['Web Development', 'Data Science', 'Design', 'Marketing']
    };
})();
