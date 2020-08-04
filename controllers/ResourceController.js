// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation
  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/
const viewPath = 'resources';
const Resource = require('../models/Resource');
const User = require('../models/User');
const resources = require('../routes/resources');


exports.index = async (req, res) => {
  try {
    const reservation = await Resource
    .find()
    .populate('user')
    .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Archive',
      reservations: reservation
    });
  }catch(error) {
    req.flash('Danger', `There was an error showing in the details: ${error}
    `);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Reservation'
  });
};

exports.create =  async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    
    const reservation = await Resource.create({user: user._id, ...req.body});

    req.flash('success', 'Reservation created successfully');
    res.redirect(`/resources/${reservation.id}`);
  } catch (error) {
    req.flash('danger', `There was an error while creating this reservation: ${error}`);
    req.session.formData = req.body;
    res.redirect('/resources/new');
  }

};

exports.show = async (req, res) => {
  try {
    const reservation = await Resource.findById(req.params.id)
      .populate('user');
    res.render(`${viewPath}/show`, {
      pageTitle: reservation.title,
      reservation: reservation
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying in this reservation: ${error}`);
    res.redirect('/');
  }
};

exports.edit = async (req, res) => {

try {
const reservation  = await Resource.findById(req.params.id);
res.render(`${viewPath}/edit`, {
  pageTitle: reservation.title,
  formData: reservation
});
}
catch(error){
req.flash('danger', `There was an error accessing this reservation: ${error}`);
res.redirect('/');
}
};

exports.update = async (req, res) => {
try {
  const{user:email} = req.session.passport;
  const user = await User.findOne({email: email});

  let reservation = await Resource.findById(req.body.id);
  if(!reserrvation) throw new Error('Reservation could not be found');
  const attributes = {user: user._id, ...req.body};
  await Resource.validate(attributes);
  await Resource.findByIdAndUpdate(attributes.id, attributes);
  req.flash('success', 'Reservation updated successfullyy');
  res.redirect(`/resources/${req.body.id}`);

}
catch(error){
  req.flash('danger', `There was an error updating this reservation: ${error}`);
  res.redirect(`/resources/${req.body.id}/edit`);
}
};

exports.delete = async (req, res) => {
try {
  await Resource.deleteOne({_id: req.body.id});
  req.flash('Successfully deleted your reservation');
  res.redirect(`/resources`);

}catch(error) {
  req.flash(`There was an error deleting your reservation: ${error}`);
  res.redirect(`/resources`);
}


}

